const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	firstName: {
		type: String,
		require: true,
	},
	lastName: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
});

module.exports = model('users', UserSchema);
