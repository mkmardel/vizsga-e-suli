const express = require('express');
const router = express.Router();
const Applicant = require('../../models/applicant');
const Course = require('../../models/course');
const { body, validationResult } = require('express-validator');
const { userAuth } = require('../../shared/authentication');

router.all('/*', userAuth, (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	Applicant.find({})
		.populate('course')
		.then((applicants) => {
			res.render('admin/applicants', { applicants: applicants });
		});
});

router.get('/edit/:id', (req, res) => {
	Applicant.findById(req.params.id)
		.populate('course')
		.then((applicant) => {
			res.render('admin/applicants/edit', { applicant: applicant });
		});
});

router.put('/edit/:id', body('status').notEmpty(), (req, res) => {
	const result = validationResult(req);
	if (result.errors && result.errors.length > 0) {
		res.render(`admin/index`, {
			error: JSON.stringify(result.errors),
		});
	} else {
		Applicant.findByIdAndUpdate(
			req.params.id,
			{ $set: { status: req.body.status } },
			async (err, doc) => {
				if (err) {
					return err;
				}

				if (req.body.status === 'approved') {
					const course = await Course.findById(req.body.course);
					course.applicants = course.applicants + 1;
					await course.save();
				}

				res.redirect('/admin/applicants');
			}
		);
	}
});

module.exports = router;
