import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Database, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { connector } from "./src/db-connector.ts";
import { Booking } from "./src/model/booking.ts";
import { User } from "./src/model/user.ts";
import { Hotel } from "./src/model/hotel.ts";
import { Disposable, setHandler } from "https://deno.land/x/ctrlc@0.2.1/mod.ts";
import { userRouter } from "./src/route/user.ts";
import { authRouter } from "./src/route/auth.ts";
import { hotelRouter } from "./src/route/hotel.ts";
import { bookingRouter } from "./src/route/booking.ts";
import { initDB } from "./src/init-db.ts";



const db = new Database(connector);
Relationships.belongsTo(Booking, User, {foreignKey: 'userId'});
Relationships.belongsTo(Booking, Hotel, {foreignKey: 'hotelId'});
db.link([ User, Hotel, Booking ]);
console.log('Syncing DB');
try {
	await db.sync();
} catch (_error) {
	console.log('DB Already Synced')
}
console.log('db Synced');
await initDB();
console.log('Starting Deno Server');
const app = new Application();
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(hotelRouter.routes());
app.use(hotelRouter.allowedMethods());
app.use(bookingRouter.routes());
app.use(bookingRouter.allowedMethods());


// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
	const _ctrlC: Disposable = setHandler(async () => {
		console.log('Stop all connections')
		await db.close()
		Deno.exit();
	});
	console.log(`Running app on port 3000`)
	await app.listen({port: 3000});
}

export { app }