import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/application.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { Database, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { testConnector } from "../src/db-connector.ts";
import { header, key } from "../src/middleware.ts";
import { Booking } from "../src/model/booking.ts";
import { Hotel } from "../src/model/hotel.ts";
import { User } from "../src/model/user.ts";
import { hotelRouter } from "../src/route/hotel.ts";

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
app.use(hotelRouter.routes());
app.use(hotelRouter.allowedMethods());

Deno.test('it should create a hotel record', async () => {
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 1,
		exp: getNumericDate(60)}, key);
	const data = {
		name: 'test',
		location: 'test',
		description: 'test',
		picture_list: 'test'
	}
	const request = await superoak(app);
	await request.post('/hotels/create')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(201)
});

Deno.test('it shouldn\'t create a hotel record (user account)', async () => {
	const token = await create(header, { email: "test@test.com",
		username: "test",
		role: "user",
		id: 1,
		exp: getNumericDate(60)}, key);
	const data = {
		name: 'test',
		location: 'test',
		description: 'test',
		picture_list: 'test'
	}
	const request = await superoak(app);
	await request.post('/hotels/create')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(403)
});

Deno.test('it shouldn\'t create a hotel record (not logged)', async () => {
	const data = {
		name: 'test',
		location: 'test',
		description: 'test',
		picture_list: 'test'
	}
	const request = await superoak(app);
	await request.post('/hotels/create')
		.send(data)
		.expect(401)
});

Deno.test('it should list hotel record', async () => {
	const request = await superoak(app);
	await request.get('/hotels/10')
		.expect(200)
});

Deno.test('it should update a hotel record', async () => {
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 1,
		exp: getNumericDate(60)}, key);
	const data = {
		description: 'test2',
	}
	const request = await superoak(app);
	await request.put('/hotels/update/1')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(200)
});

Deno.test('it should delete a hotel record', async () => {
	const token = await create(header, { email: "admin@admin.com",
		username: "admin",
		role: "admin",
		id: 1,
		exp: getNumericDate(60)}, key);
	const data = {
		description: 'test2',
	}
	const request = await superoak(app);
	await request.delete('/hotels/delete/1')
		.set('Cookie', [`token=${token}`])
		.send(data)
		.expect(202)
});