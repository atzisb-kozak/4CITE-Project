import { Model, DataTypes } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Booking } from "./booking.ts";

export class User extends Model {
	static table = 'users';
	static timestamps = true;

	static fields = {
		id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER},
		email: {type: DataTypes.STRING, unique: true},
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		role: DataTypes.enum(['user', 'employe', 'admin'])
	};

	static defaults = {
		role: 'user'
	};

	static bookings() {
		return this.hasMany(Booking);
	}

	static hashingPassword(password: string) {
		return bcrypt.hash(password);
	}
}