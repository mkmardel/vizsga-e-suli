const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const ApplicantSchema = new Schema(
	{
		course: {
			type: Schema.Types.ObjectId,
			ref: 'courses',
		},
		name: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		status: {
			type: String,
			default: 'in_progress',
		},
		dateOfBirth: {
			type: Date,
		},
	},
	{ usePushEach: true }
);

try {
	module.exports = mongoose.model('applicants', ApplicantSchema);
} catch (e) {
	module.exports = mongoose.model('applicants');
}
