import { Model, DataTypes } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { Hotel } from "./hotel.ts";
import { User } from "./user.ts";

export class Booking extends Model {
	static table = 'bookings';
	static timestamps = true;

	static fields = {
		id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER},
		bookedStart: DataTypes.DATETIME,
		bookedEnd: DataTypes.DATETIME,
	};

	static client() {
		return this.hasOne(User);
	}

	static hotel() {
		return this.hasOne(Hotel);
	}
}