const { Schema, model } = require('mongoose');
const CategorySchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	body: {
		type: String,
		require: true,
	},
});

try {
	module.exports = model('categories', CategorySchema);
} catch (e) {
	module.exports = model('categories');
}
