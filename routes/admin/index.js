const express = require('express');
const router = express.Router();
const About = require('../../models/about');
const { userAuth } = require('../../shared/authentication');
const { body, validationResult } = require('express-validator');

router.all('/*', userAuth, (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	res.render('admin/index', {});
});

router.get('/about', (req, res) => {
	About.find({}).then((aboutArr) => {
		res.render('admin/about', {
			about: aboutArr[0],
		});
	});
});

router.post('/about/update', body('body').notEmpty(), (req, res) => {
	const result = validationResult(req);
	if (result.errors && result.errors.length > 0) {
		res.render(`admin/index`, {
			error: JSON.stringify(result.errors),
		});
	} else {
		About.find({}).then((aboutArr) => {
			let updatedObj = aboutArr[0];
			updatedObj.body = req.body.body;

			updatedObj.save().then((obj) => {
				res.render('admin/about', {
					about: obj,
					success: 'Sikeresen módosítva.',
				});
			});
		});
	}
});

module.exports = router;
