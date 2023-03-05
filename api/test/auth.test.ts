import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/application.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { Database, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { testConnector } from "../src/db-connector.ts";
import { initDB } from "../src/init-db.ts";
import { header, key } from "../src/middleware.ts";
import { Booking } from "../src/model/booking.ts";
import { Hotel } from "../src/model/hotel.ts";
import { User } from "../src/model/user.ts";
import { authRouter } from "../src/route/auth.ts";

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
await initDB();
console.log('db Synced');
console.log('Starting Deno Server');
const app = new Application();
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

Deno.test('it should register a user', async () => {
	const data = {
		email: "test@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
	const request = await superoak(app);
	await request.post('/auth/register')
		.send(data)
		.expect('User Created')
});

Deno.test('it shouldn\'t register a user as logged', async () => {
	const data = {
		email: "test2@test.com",
		username: "test",
		role: "user",
		password:"testpwd"
	}
		const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 2,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.post('/auth/register')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(400)
});

Deno.test('it should login a user', async () => {
	const data = {
		email: "test@test.com",
		password:"testpwd"
	}
	const request = await superoak(app);
	await request.post('/auth/login')
		.send(data)
		.expect(201)
});

Deno.test('it shouldn\'t login a user as logged', async () => {
	const data = {
		email: "test@test.com",
		password:"testpwd"
	}
		const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 2,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.post('/auth/login')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(400)
});

Deno.test('it should logout a user', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 2,
		exp: getNumericDate(60)}, key);
	const request = await superoak(app);
	await request.post('/auth/logout')
		.set('Cookie', [`token=${token}`])
		.expect(201)
});

Deno.test('it shouldn\'t logout a user as not logged', async () => {
	const request = await superoak(app);
	await request.post('/auth/logout')
		.expect(401)
});