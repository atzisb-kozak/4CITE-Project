import { Model, DataTypes } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import { Booking } from "./booking.ts";

export class Hotel extends Model {
	static table = 'hotels';
	static timestamps = true;

	static fields = {
		id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER},
		name: DataTypes.STRING,
		location: DataTypes.STRING,
		description: DataTypes.STRING,
		picture_list: DataTypes.STRING
	};

	static bookings() {
		return this.hasMany(Booking);
	}
}