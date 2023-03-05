import { User } from "./model/user.ts";
import { Hotel } from "./model/hotel.ts";

export async function initDB() {
	const admin = await User.select().where('username', 'admin').first();
	if (!admin) {
		const hashedPassword = await User.hashingPassword('adminpwd')
		const _user = await User.create({
			email: 'admin@admin.com',
			username: 'admin',
			role: 'admin',
			password: hashedPassword
		});
		const hotels = [
			{name: '',location: '',description: '',picture_list: ''},
			{name: '',location: '',description: '',picture_list: ''},
			{name: '',location: '',description: '',picture_list: ''},
			{name: '',location: '',description: '',picture_list: ''},
			{name: '',location: '',description: '',picture_list: ''}]
		hotels.forEach(async (hotel) => {
			await Hotel.create({
				name: hotel.name,
				location: hotel.location,
				description: hotel.description,
				picture_list: hotel.picture_list
			})
		})
	}
}