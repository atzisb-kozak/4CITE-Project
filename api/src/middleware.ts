import { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Header, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

export const key = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-256'},
	true,
	['sign', 'verify']
);

export const header: Header = {
	alg: 'HS256',
	typ: 'JWT'
}

export const loggedMiddleware: Middleware = async (ctx, next) => {
	try {
		const token = await ctx.cookies.get('token');
		if (token) {
			const _result = await verify(token, key);
			await next();
		} else {
			throw Error('User not Logged');
		}
	} catch (_error) {
		ctx.response.status = 401;
		ctx.response.body = 'Not Logged';
	}
}

export const notLoggedMiddleware: Middleware = async (ctx, next) => {
	try {
		const token = await ctx.cookies.get('token');
		if (token) {
			const _result = await verify(token, key);
			throw Error('User already logged');
		} else {
			await next()
		}
	} catch (error) {
		if (error.message === 'User already logged'){
			ctx.response.status = 400
			ctx.response.body = error.message;
		} else {
			ctx.response.status = 400
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
}

export const employeeMiddleware: Middleware = async (ctx, next) => {
	try {
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role === 'admin' || result.role === 'employe') {
				await next();
			} else {
				throw Error('User not employe');
			}
		} else {
			throw Error('User not Logged');
		}
	} catch (error) {
		if (error.message === 'User not employe') {
			ctx.response.status = 403;
			ctx.response.body = 'User not employe';
		} else {
			ctx.response.status = 401;
			ctx.response.body = 'Not Logged';
		}
	}
}

export const adminMiddleware: Middleware = async (ctx, next) => {
	try {
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role === 'admin') {
				await next();
			} else {
				throw Error('User not admin');
			}
		} else {
			throw Error('User not Logged');
		}
	} catch (error) {
		if (error.message === 'User not admin') {
			ctx.response.status = 403;
			ctx.response.body = 'User not admin';
		} else {
			ctx.response.status = 401;
			ctx.response.body = 'Not Logged';
		}
	}
}