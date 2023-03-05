import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/application.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { Database, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { testConnector } from "../src/db-connector.ts";
import { header, key } from "../src/middleware.ts";
import { Booking } from "../src/model/booking.ts";
import { Hotel } from "../src/model/hotel.ts";
import { User } from "../src/model/user.ts";
import { userRouter } from "../src/route/user.ts";

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
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

Deno.test('it should create a user', async () => {
	const data = {
		email: "test@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
	const request = await superoak(app);
	await request.post('/users/create')
		.send(data)
		.expect(201)
});

Deno.test('it should create a admin user', async () => {

	const data = {
		email: "admin@admin.com",
		username: "admin",
		role: "admin",
		password:"adminpwd"
	}
	const request = await superoak(app);
	await request.post('/users/create')
		.send(data)
		.expect(201)
});

Deno.test('it shouldn\'t create a duplicate email user', async () => {
	const data = {
		email: "test@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
	const request = await superoak(app);
	await request.post('/users/create')
		.send(data)
		.expect(400)
});

Deno.test('it should return a user', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	
	const request = await superoak(app);
	await request.get('/users/1')
		.set('Cookie', [`token=${token}`])
		.expect(200)
});

Deno.test('it should return a user (mail)', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	
	const request = await superoak(app);
	await request.get('/users/mail/test@test.com')
		.set('Cookie', [`token=${token}`])
		.expect(200)
});

Deno.test('it should return a user (admin)', async () => {
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 2,
		exp: getNumericDate(60)}, key);
	
	const request = await superoak(app);
	await request.get('/users/1')
		.set('Cookie', [`token=${token}`])
		.expect(200)
});

Deno.test('it shouldn\'t return a non-existing user (admin)', async () => {
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 2,
		exp: getNumericDate(60)}, key);
	
	const request = await superoak(app);
	await request.get('/users/10')
		.set('Cookie', [`token=${token}`])
		.expect(404)
});

Deno.test('it shouldn\'t return a different user', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.get('/users/2')
		.set('Cookie', [`token=${token}`])
		.expect(403)
});

Deno.test('it shouldn\'t return a user (not logged)', async () => {
	const request = await superoak(app);
	await request.get('/users/1')
		.expect(401)
});

Deno.test('it should update a user', async () => {
	const data = {
		username: "testupdate",
	}
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);

	const request = await superoak(app);
	await request.put('/users/update/1')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(200)
});

Deno.test('it should update a user (admin)', async () => {
	const data = {
		username: "test",
	}
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 2,
		exp: getNumericDate(60)}, key);

	const request = await superoak(app);
	await request.put('/users/update/1')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(200)
});

Deno.test('it shouldn\' update a different user', async () => {
	const data = {
		username: "testupdate",
	}
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);

	const request = await superoak(app);
	await request.put('/users/update/2')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(403)
});

Deno.test('it should delete a user', async () => {
	const data = {
		email: "test2@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
	const requestCreate = await superoak(app);
	await requestCreate.post('/users/create')
		.send(data)
		.expect(201)
	
	const token = await create(header, { email: "test2@test.com",
		username: "test",
		role: "user",
		id: 3,
		exp: getNumericDate(60)}, key);

	const requestDelete = await superoak(app);
	await requestDelete.delete('/users/delete/3')
		.set('Cookie', [`token=${token}`])
		.expect(202)
});

Deno.test('it shouldn\'t delete a user', async () => {
	const data = {
		email: "test2@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
	const requestCreate = await superoak(app);
	await requestCreate.post('/users/create')
		.send(data)
		.expect(201)
	
	const token = await create(header, { email: "test2@test.com",
		username: "test",
		role: "user",
		id: 4,
		exp: getNumericDate(60)}, key);

	const requestDelete = await superoak(app);
	await requestDelete.delete('/users/delete/1')
		.set('Cookie', [`token=${token}`])
		.expect(403)
});

