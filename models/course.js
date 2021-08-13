const { Schema } = require('mongoose');

const UrlSlugs = require('mongoose-url-slugs');
const mongoose = require('mongoose');

const CourseSchema = new Schema(
	{
		category: {
			type: Schema.Types.ObjectId,
			ref: 'categories',
		},
		title: {
			type: String,
			require: true,
		},
		slug: {
			type: String,
		},
		body: {
			type: String,
			require: true,
		},
		forcedVisibility: {
			type: Boolean,
			default: false,
		},
		applicants: {
			type: Number,
			default: 0,
		},
		file: {
			type: String,
		},
		startDate: {
			type: Date,
		},
	},
	{ usePushEach: true }
);

CourseSchema.plugin(UrlSlugs('title', { field: 'slug' }));

try {
	module.exports = mongoose.model('courses', CourseSchema);
} catch (e) {
	module.exports = mongoose.model('courses');
}
