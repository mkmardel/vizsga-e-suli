const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const Category = require('../../models/category');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { userAuth } = require('../../shared/authentication');

router.all('/*', userAuth, (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	Course.find({})
		.populate('category')
		.then((courses) => {
			res.render('admin/courses', { courses: courses });
		});
});

router.get('/create', async (req, res) => {
	let categories = await Category.find({});
	let canAddNew = categories.length > 0;
	res.render('admin/courses/create', {
		canAddNew: canAddNew,
		categories: categories,
	});
});

router.get('/edit/:id', async (req, res) => {
	let categories = await Category.find({});
	const course = await Course.findById(req.params.id).populate('category');
	res.render('admin/courses/edit', {
		categories: categories,
		course: course,
	});
});

router.post(
	'/',
	body('title').notEmpty(),
	body('body').notEmpty(),
	body('category').notEmpty(),
	body('startDate').notEmpty(),
	async (req, res) => {
		const result = validationResult(req);
		const categories = await Category.find({});

		if (result.errors && result.errors.length > 0) {
			res.render('admin/courses/create', {
				error: JSON.stringify(result.errors),
				categories: categories,
				canAddNew: categories.length > 0,
			});
		} else {
			const courseWithTitle = await Course.find({ title: req.body.title });
			if (courseWithTitle.length > 0) {
				return res.render('admin/courses/create', {
					error: 'A megadott tanfolyam már létezik.',
					categories: categories,
					canAddNew: categories.length > 0,
				});
			}

			let fileName = 'no-image.jpg';
			if (!isEmpty(req.files)) {
				const file = req.files.file;
				fileName = `${Date.now()}-${file.name}`;
				file.mv(`./public/images/${fileName}`, (error) => {
					if (error) {
						throw error;
					}
				});
			}
			const forcedVisibility = req.body.forcedVisibility != undefined;
			const newCourse = new Course({
				title: req.body.title,
				body: req.body.body,
				category: req.body.category,
				file: fileName,
				startDate: req.body.startDate,
				forcedVisibility: forcedVisibility,
			});

			newCourse.save().then((_) => {
				res.redirect('/admin/courses');
			});
		}
	}
);

router.put(
	'/:id',
	body('title').notEmpty(),
	body('body').notEmpty(),
	body('category').notEmpty(),
	body('startDate').notEmpty(),
	async (req, res) => {
		const result = validationResult(req);
		let course = await Course.findById(req.params.id).populate('category');
		if (result.errors && result.errors.length > 0) {
			res.render(`admin/courses/edit`, {
				course: course,
				error: JSON.stringify(result.errors),
			});
		} else {
			let originalFileName = course.file;
			let fileName = originalFileName;
			if (!isEmpty(req.files)) {
				const file = req.files.file;
				fileName = `${Date.now()}-${file.name}`;

				fs.unlink(`./public/images/${originalFileName}`, () => {
					file.mv(`./public/images/${fileName}`, (error) => {
						if (error) {
							throw error;
						}
					});
				});
			}

			const forcedVisibility = req.body.forcedVisibility != undefined;

			course.title = req.body.title;
			course.body = req.body.body;
			course.category = req.body.category;
			course.file = fileName;
			course.startDate = req.body.startDate;
			course.forcedVisibility = forcedVisibility;

			course.save().then((_) => {
				res.redirect('/admin/courses');
			});
		}
	}
);

router.get('/delete/:id', async (req, res) => {
	let course = await Course.findById(req.params.id);
	if (course.applicants > 0) {
		const courses = await Course.find({}).populate('category');
		return res.render('admin/courses', {
			courses: courses,
			error: 'Olyan tanfolyam nem törölhető amelyhez tartoznak résztvevők.',
		});
	}

	Course.findByIdAndRemove(req.params.id).then((_) => {
		fs.unlink(`./public/images/${course.file}`, () => {
			res.redirect('/admin/courses');
		});
	});
});

const isEmpty = (obj) => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

module.exports = router;
