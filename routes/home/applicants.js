const express = require('express');
const router = express.Router();
const Applicant = require('../../models/applicant');
const Course = require('../../models/course');
const { body, validationResult } = require('express-validator');

router.post(
	'/create',
	body('course').notEmpty(),
	body('name').notEmpty(),
	body('email').notEmpty(),
	body('email').isEmail(),
	body('dateOfBirth').notEmpty(),
	async (req, res) => {
		const result = validationResult(req);
		const courses = await Course.find({ slug: req.body.course }).populate(
			'category'
		);
		let appliedCourse = courses[0];

		if (result.errors && result.errors.length > 0) {
			res.render(`home/course`, {
				course: appliedCourse,
				error: JSON.stringify(result.errors),
			});
		} else {
			const newApplicant = new Applicant({
				course: appliedCourse._id,
				name: req.body.name,
				email: req.body.email,
				da: req.body.category,
				dateOfBirth: req.body.dateOfBirth,
			});

			newApplicant.save().then((_) => {
				res.render(`home/course`, {
					course: appliedCourse,
					success: 'Sikeresen jelentkeztél a tanfolyamra.',
				});
			});
		}
	}
);

const isEmpty = (obj) => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

module.exports = router;
