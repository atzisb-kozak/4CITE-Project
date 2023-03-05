import * as _mod from "https://deno.land/std@0.178.0/datetime/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/application.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { Database, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { testConnector } from "../src/db-connector.ts";
import { header, key } from "../src/middleware.ts";
import { Booking } from "../src/model/booking.ts";
import { Hotel } from "../src/model/hotel.ts";
import { User } from "../src/model/user.ts";
import { bookingRouter } from "../src/route/booking.ts";

const db = new Database(testConnector);
Relationships.belongsTo(Booking, User, {foreignKey: 'userId'});
Relationships.belongsTo(Booking, Hotel, {foreignKey: 'hotelId'});
db.link([ User, Hotel, Booking ]);
console.log('Syncing DB');
try {
	await db.sync({drop: true});
} catch (_error) {
	console.log('DB Already Synced')
}
console.log('db Synced');
console.log('Starting Deno Server');
const app = new Application();
app.use(bookingRouter.routes());
app.use(bookingRouter.allowedMethods());

await User.create({
	email: "test@test.com",
	username: "test",
	role: "user",
	password: await User.hashingPassword('testpwd')
});

await Hotel.create({
	name: 'test',
	location: 'test',
	description: 'test',
	picture_list: 'test'
})

Deno.test('it should create a booking record', async () => {
	try {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const data = {
		user_id: 1,
		hotel_id: 1,
		bookedStart: "2023-03-05 11:36:13.822215+00",
		bookedEnd: "2023-03-05 11:36:13.822215+00"
	}
	const request = await superoak(app);
	await request.post('/bookings/create')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(201)
	} catch (error) {
		console.log(error)
	}

});

Deno.test('it should read a bookings record', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.get('/bookings')
		.set('Cookie', [`token=${token}`])
		.expect(200)
});

Deno.test('it should update a booking record', async () => {
	const data = {
		bookedStart: "2023-03-05 11:36:53.822215+00"
	}
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.put('/hotels/update/1')
		.send(data)
		.set('Cookie', [`token=${token}`])
		.expect(200)
});

Deno.test('it should delete a booking record', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.delete('/hotels/delete/1')
		.set('Cookie', [`token=${token}`])
		.expect(200)
});