const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const expressHandlebars = require('express-handlebars');
const {
	generateDate,
	pagination,
	teaserText,
	isPassed,
	isVisible,
	getStatus,
	select,
	ifEq,
	checked,
} = require('./directives/handlebar.directive');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const addFakeData = require('./shared/fakedata');

mongoose.Promise = global.Promise;

mongoose
	.connect('mongodb://localhost:27017/vizsga-e-suli', {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.catch((error) => console.error(error));

addFakeData();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'handlebars',
	expressHandlebars({
		defaultLayout: 'home',
		helpers: {
			generateDate: generateDate,
			pagination: pagination,
			teaser: teaserText,
			isPassed: isPassed,
			isVisible: isVisible,
			getStatus: getStatus,
			select: select,
			ifEq: ifEq,
			checked: checked,
		},
		handlebars: allowInsecurePrototypeAccess(Handlebars),
	})
);
app.set('view engine', 'handlebars');

app.use(upload());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(
	session({
		secret: 'vizsgaesuli',
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	res.locals.success_message = req.flash('success');
	res.locals.warning_message = req.flash('warning');
	res.locals.error_message = req.flash('error');
	next();
});

app.use('/', require('./routes/home/index'));
app.use('/admin', require('./routes/admin/index'));
app.use('/home/applicants', require('./routes/home/applicants'));
app.use('/admin/applicants', require('./routes/admin/applicants'));
app.use('/admin/categories', require('./routes/admin/categories'));
app.use('/admin/courses', require('./routes/admin/courses'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
