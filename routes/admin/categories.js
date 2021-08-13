const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const Category = require('../../models/category');
const { body, validationResult } = require('express-validator');
const { userAuth } = require('../../shared/authentication');

router.all('/*', userAuth, (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	Category.find({}).then((categories) => {
		res.render('admin/categories', { categories: categories });
	});
});

router.get('/create', (req, res) => {
	res.render('admin/categories/create');
});

router.get('/edit/:id', async (req, res) => {
	const category = await Category.findById(req.params.id);
	res.render('admin/categories/edit', { category: category });
});

router.post(
	'/',
	body('name').notEmpty(),
	body('body').notEmpty(),
	async (req, res) => {
		const result = validationResult(req);
		if (result.errors && result.errors.length > 0) {
			res.render(`admin/categories/create`, {
				error: JSON.stringify(result.errors),
			});
		} else {
			let categoryWithName = await Category.find({
				name: capitalizeFirstLetter(req.body.name),
			});
			if (categoryWithName.length > 0) {
				return res.render(`admin/categories/create`, {
					error: 'A megadott kategória már létezik!',
				});
			}

			const newCategory = new Category({
				name: capitalizeFirstLetter(req.body.name),
				body: req.body.body,
			});

			newCategory.save().then((_) => {
				res.redirect('/admin/categories');
			});
		}
	}
);

router.put(
	'/:id',
	body('name').notEmpty(),
	body('body').notEmpty(),
	async (req, res) => {
		const result = validationResult(req);
		let category = await Category.findById(req.params.id);
		if (result.errors && result.errors.length > 0) {
			res.render(`admin/categories/edit`, {
				category: category,
				error: JSON.stringify(result.errors),
			});
		} else {
			category.name = req.body.name;
			category.body = req.body.body;

			category.save().then((_) => {
				res.redirect('/admin/categories');
			});
		}
	}
);

router.get('/delete/:id', async (req, res) => {
	let category = await Category.findById(req.params.id);
	let coursesWithCategory = await Course.find({ category: category._id });
	if (coursesWithCategory.length > 0) {
		const categories = await Category.find({});
		return res.render('admin/categories', {
			categories: categories,
			error: 'Olyan kategória nem törölhető amelyhez tartozik tanfolyam.',
		});
	}

	Category.findByIdAndRemove(req.params.id).then((_) => {
		res.redirect('/admin/categories');
	});
});

const capitalizeFirstLetter = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = router;
