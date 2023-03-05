import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { adminMiddleware } from "../middleware.ts";
import { Hotel } from "../model/hotel.ts";

export const hotelRouter = new Router();

hotelRouter.get('/hotels/:limit', async (ctx) => {
	try {
		const param = ctx.params.limit
		const hotel = await Hotel.select().limit(parseInt(param)).get();
		if (hotel.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found Hotel'
		} else {
			ctx.response.status = 200;
			ctx.response.body = hotel;
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

hotelRouter.post('/hotels/create', adminMiddleware,async (ctx) => {
	try {
		const body = await ctx.request.body().value;
		const _Hotel = await Hotel.create({
			name: body.name,
			location: body.location,
			description: body.description,
			picture_list: body.picture_list
		});
		ctx.response.status = 201
		ctx.response.body = 'Hotel Created'
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
});

hotelRouter.put('/hotels/update/:id', adminMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const body = await ctx.request.body().value;
		const hotel = await Hotel.where('id', param).update(body);
		if (hotel.length === 0) {
			ctx.response.status = 404;
			ctx.response.body = 'Not Found Hotel';
		} else {
			ctx.response.status = 200;
			ctx.response.body = 'Hotel Updated';
		}
	} catch (error) {
		if (error.message === 'Hotel unauthorize') {
			ctx.response.status = 403
			ctx.response.body = 'Hotel Forbidden'
		} else {
			ctx.response.status = 400;
			ctx.response.body = `Error on request ${error.message}`;
		}
	}
})

hotelRouter.delete('/hotels/delete/:id', adminMiddleware, async (ctx) => {
	try {
		const param = ctx.params.id;
		const hotel = await Hotel.where('id', param).delete()
		if (hotel.length === 0) {
			ctx.response.status = 404
			ctx.response.body = 'Not Found Hotel'
		} else {
			ctx.response.status = 202;
			ctx.response.body = 'Hotel Deleted';
		}
	} catch (error) {
		ctx.response.status = 400;
		ctx.response.body = `Error on request ${error.message}`;
	}
})
