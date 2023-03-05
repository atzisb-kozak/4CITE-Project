import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { adminMiddleware, key, loggedMiddleware } from "../middleware.ts";
import { Booking } from "../model/booking.ts";

export const bookingRouter = new Router();

bookingRouter.get('/bookings', loggedMiddleware, async (ctx) => {
	try {
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			const id = String(result.id)
			const booking = await Booking.select('id', 'user_id', 'hotel_id', 'bookedStart', 'bookedEnd').where('user_id', id).get();
			if (booking.length === 0) {
				ctx.response.status = 404
				ctx.response.body = 'Not Found Booking'
			} else {
				ctx.response.status = 200;
				ctx.response.body = booking;
			}
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

bookingRouter.get('/bookings/:id', adminMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id
		const booking = await Booking.select('id', 'user_id', 'hotel_id', 'bookedStart', 'bookedEnd').where('user_id', param).get();
		if (booking.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found Booking'
		} else {
			ctx.response.status = 200;
			ctx.response.body = booking;
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

bookingRouter.post('/bookings/create', loggedMiddleware,async (ctx) => {
	try {
		const body = await ctx.request.body().value;
		const _Booking = await Booking.create({
			user_id: body.user_id,
			hotel_id: body.hotel_id,
			bookedStart: body.bookedStart,
			bookedEnd: body.bookedEnd
		});
		ctx.response.status = 201
		ctx.response.body = 'Booking Created'
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

bookingRouter.put('/bookings/update/:id', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const body = await ctx.request.body().value;
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.id !== param) {
				throw Error('Booking unauthorize');
			}
		}
		const booking = await Booking.where('id', param).update(body);
		if (booking.length === 0) {
			ctx.response.status = 404;
			ctx.response.body = 'Not Found Booking';
		} else {
			ctx.response.status = 200;
			ctx.response.body = 'Booking Updated';
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
})

bookingRouter.delete('/bookings/delete/:id', loggedMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const token = await ctx.cookies.get('token');
		if (token) {
			const result = await verify(token, key);
			if (result.role !== 'admin' && result.id !== param) {
				throw Error('Booking unauthorize');
			}
		}
		const booking = await Booking.where('id', param).delete()
		if (booking.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found Booking'
		} else {
			ctx.response.status = 202;
			ctx.response.body = 'Booking Deleted';
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
})
