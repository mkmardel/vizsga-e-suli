const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const About = require('../../models/about');
const User = require('../../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'home';
	next();
});

router.get('/', async (req, res, next) => {
	const perPage = 4;
	const page = req.query.page || 1;

	let allCourses = await Course.find({});
	let favCourses = allCourses
		.sort(function (a, b) {
			return b.applicants - a.applicants;
		})
		.slice(0, 4);

	Course.find({})
		.skip(perPage * page - perPage)
		.limit(perPage)
		.then((courses) => {
			Course.count().then((coursesSum) => {
				res.render('home/index', {
					courses: courses,
					current: parseInt(page),
					favourites: favCourses,
					pages: Math.ceil(coursesSum / perPage),
				});
			});
		});
});

router.get('/about', (req, res) => {
	About.find({}).then((aboutArr) => {
		res.render('home/about', {
			about: aboutArr[0],
		});
	});
});

router.get('/login', (req, res) => {
	res.render('home/login');
});

passport.use(
	new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
		User.findOne({ email: email }).then((user) => {
			if (!user) {
				return done(null, false, { message: 'User not found' });
			}
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) {
					return done(err, false);
				}
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Wrong password' });
				}
			});
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(
		(user) => done(null, user),
		(err) => done(err, false)
	);
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash: true,
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/login');
});

router.get('/course/:slug', (req, res) => {
	Course.findOne({ slug: req.params.slug })
		.populate('category')
		.then((course) => {
			res.render('home/course', { course: course });
		});
});

module.exports = router;
