import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { header, key, loggedMiddleware, notLoggedMiddleware } from "../middleware.ts";
import { User } from "../model/user.ts";

export const authRouter = new Router();

authRouter.post('/auth/register', notLoggedMiddleware, async (ctx) => {
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
})

authRouter.post('/auth/login', notLoggedMiddleware, async (ctx) => {
	try {
		const body = await ctx.request.body().value
		const user = await User.select('id', 'email', 'username', 'password', 'role').where('email', body.email).first();
		if (!user) {
			ctx.response.status = 404;
			ctx.response.body = 'User not exists';
			return;
		} else {
			const compare = await bcrypt.compare(body.password,user.password.toString())
			if (compare) {
				const token = await create(header, {id: user.id, email: user.email, username: user.username, role: user.role, exp: getNumericDate(60)}, key);
				ctx.response.status = 201;
				ctx.response.body = 'User Logged'
				ctx.cookies.set('token', token)
			} else {
				ctx.response.status = 401;
				ctx.response.body = 'authentication failed';
			}
		}
		
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on Request : ${error.message}`;
	}
})

authRouter.post('/auth/logout', loggedMiddleware, (ctx) => {
	ctx.response.status = 201
	ctx.response.body = 'Logout'
	ctx.cookies.delete('token');
})