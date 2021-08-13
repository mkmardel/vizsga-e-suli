const About = require('../models/about');
const Category = require('../models/category');
const Course = require('../models/course');
const User = require('../models/user');
const Applicant = require('../models/applicant');
const bcrypt = require('bcryptjs');

module.exports = function addFakeData() {
	addAbout();
	addCategories(); // Courses and applicants will be added with categories
	addAdmin();
};

const addAbout = function () {
	About.find({}).then((aboutArr) => {
		if (aboutArr.length === 0) {
			const about = new About();
			about.body =
				'Az E-Suli egy új kezdeményezés az online oktatás területén. Napjainkban a megnövekedett igények miatt szükség van olyan internetes platformokra, melyek segítik az embereket a távoli tanulásban. Legyél akár úton, akár otthon, bátran válassz induló tanfolyamaink közül. Hajrá!';
			about.save();
		}
	});
};

const addCategories = function () {
	Category.find({}).then(async (categories) => {
		if (categories.length === 0) {
			let category = new Category();
			// Category #1
			category.name = 'Zene';
			category.body =
				'A zene a hangok és a csend érzelmeket kiváltó elrendezése, létezésének lényege az idő. A pontos meghatározás nem könnyű, de abban általában egyetértés mutatkozik, hogy a zene a hangok tudatosan elrendezett folyamata.';
			await category.save();

			// Category #2
			category = new Category();
			category.name = 'Webfejlesztés';
			category.body =
				'A Webfejlesztő tanfolyamon résztvevők elsajátítják - legalább technikusi szinten - webes környezetben működő alkalmazások készítését.';
			category.save((err, category) => {
				addCourses(category);
			});
		}
	});
};

const addCourses = function (category) {
	Course.find({}).then(async (courses) => {
		if (courses.length === 0) {
			let course = new Course();
			// Course #1
			course.category = category;
			course.title = 'Angular fejlesztő';
			course.body =
				'Gyere és válaszd az Angular tanfolyamot, ugyanis ez a Google fejlesztése által készített és nyílt forráskódú megoldás rengeteg lehetőséget rejt számodra. Az Angular egyik legnagyobb előnye az, hogy széles körben elterjedt, valamint újabb és újabb verziók érhetők el belőle a folyamatos fejlesztéseknek köszönhetően.';
			course.forcedVisibility = false;
			course.applicants = 0;
			course.file = 'angular.jpg';
			course.startDate = new Date(2021, 10, 01);
			await course.save();

			//Course #2
			course = new Course();
			course.category = category;
			course.title = 'NodeJS fejlesztő';
			course.body =
				'A Node.JS viszonylag fiatalnak számít a szerveroldali feldolgozórendszerek közt, mégis széles körben tudott könnyedén elterjedni. Az alapítók úgy gondolták, hogy teljesen átvariálják a korábban megszokott trendeket és egy olyan feldolgozórendszert hoznak létre, amely sokkal jobban optimalizált, ugyanis nincs szüksége külön webszerverre.';
			course.forcedVisibility = false;
			course.applicants = 0;
			course.file = 'nodejs.png';
			course.startDate = new Date(2022, 02, 01);
			await course.save();

			//Course #3
			course = new Course();
			course.category = category;
			course.title = 'PHP fejlesztő';
			course.body =
				'A PHP leginkább dinamikus weboldalak üzemeltetésére, valamint létrehozására szolgáló leíró nyelv. Nem csupán azért terjedt el, mert az első scriptek között jött létre, hanem azért is, mert folyamatosan és dinamikusan fejlődik. Tanfolyamaunkon megmutatjuk, hogyan tudod a szerver oldali programozás minden trükkjét elsajátítani, valamint bevezetünk a parancssori programozásba.';
			course.forcedVisibility = false;
			course.applicants = 1;
			course.file = 'php.jpg';
			course.startDate = new Date(2022, 04, 01);
			course.save().then((course) => {
				addApplicants(course);
			});
		}
	});
};

const addAdmin = function () {
	User.find({}).then((users) => {
		if (users.length === 0) {
			const newUser = new User({
				firstName: 'Teszt',
				lastName: 'Admin',
				email: 'admin@admin.hu',
				password: 'admin',
			});

			bcrypt.genSalt(10).then((salt) => {
				bcrypt.hash(newUser.password, salt).then(async (hash) => {
					newUser.password = hash;
					await newUser.save();
				});
			});
		}
	});
};

const addApplicants = function (course) {
	Applicant.find({}).then(async (applicants) => {
		if (applicants.length === 0) {
			let applicant = new Applicant();

			//Applicant #1
			applicant.course = course._id;
			applicant.name = 'Gipsz Jakab';
			applicant.email = 'gipsz@jakab.hu';
			applicant.status = 'approved';
			applicant.dateOfBirth = new Date(1990, 02, 11);
			await applicant.save();

			//Applicant #2
			applicant = new Applicant();
			applicant.course = course._id;
			applicant.name = 'Teszt Elek';
			applicant.email = 'teszt@elek.hu';
			applicant.dateOfBirth = new Date(1973, 05, 18);
			applicant.save();
		}
	});
};
