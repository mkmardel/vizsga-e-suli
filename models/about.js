const { Schema, model } = require('mongoose');
const AboutSchema = new Schema({
	body: {
		type: String,
		require: true,
	},
});

try {
	module.exports = model('about', AboutSchema);
} catch (e) {
	module.exports = model('about');
}
