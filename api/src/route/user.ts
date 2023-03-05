import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { key, loggedMiddleware } from "../middleware.ts";
import { User } from "../model/user.ts";

export const userRouter = new Router();

userRouter.get('/users/:id', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.id !== parseInt(param)) {
				throw Error('User unauthorize');
			}
		}
		const user = await User.select('id', 'email', 'username', 'role').where('id', param).get();
		if (user.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found User'
		} else {
			ctx.response.status = 200;
			ctx.response.body = user;
		}
	} catch (error) {
		if (error.message === 'User unauthorize') {
			ctx.response.status = 403
			ctx.response.body = 'User Forbidden'
		} else {
			ctx.response.status = 400;
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
});

userRouter.get('/users/mail/:email', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.email
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.email !== param) {
				throw Error('User unauthorize');
			}
		}
		const user = await User.select('id', 'email', 'username', 'role').where('email', param).get();
		if (user.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found User'
		} else {
			ctx.response.status = 200;
			ctx.response.body = user;
		}
	} catch (error) {
		if (error.message === 'User unauthorize') {
			ctx.response.status = 403
			ctx.response.body = 'User Forbidden'
		} else {
			ctx.response.status = 400;
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
})

userRouter.post('/users/create', async (ctx) => {
	try {
		const body = await ctx.request.body().value;
		const hashedPassword = await User.hashingPassword(body.password)
		const _user = await User.create({
			email: body.email,
			username: body.username,
			role: body.role,
			password: hashedPassword
		});
		ctx.response.status = 201
		ctx.response.body = 'User Created'
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

userRouter.put('/users/update/:id', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const body = await ctx.request.body().value;
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.id !== parseInt(param)) {
				throw Error('User unauthorize');
			}
		}
		const user = await User.where('id', param).update(body);
		if (user.length === 0) {
			ctx.response.status = 404;
			ctx.response.body = 'Not Found User';
		} else {
			ctx.response.status = 200;
			ctx.response.body = 'User Updated';
		}
	} catch (error) {
		if (error.message === 'User unauthorize') {
			ctx.response.status = 403
			ctx.response.body = 'User Forbidden'
		} else {
			ctx.response.status = 400;
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
})

userRouter.delete('/users/delete/:id', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.id !== parseInt(param)) {
				throw Error('User unauthorize');
			}
		}
		const user = await User.where('id', param).get()
		if (user.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found User'
		} else {
			await User.where('id', param).delete()
			ctx.response.status = 202;
			ctx.response.body = 'User Deleted';
			ctx.cookies.delete('token');
		}
	} catch (error) {
		if (error.message === 'User unauthorize') {
			ctx.response.status = 403
			ctx.response.body = 'User Forbidden'
		} else {
			ctx.response.status = 400;
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
})
