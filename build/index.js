let gulp = require('gulp'),
	webpack = require('webpack'),
	browser = require('../browser.config'),
	npm = require('../npm.config'),
	test = require('../test.config');

let log = next =>
	(err, stats) => {
		if (err) {
			throw new Error(err);
		}
		console.log(stats.toString());
		next();
	};

gulp.task('build', ['npm', 'browser']);

gulp.task('npm', next => webpack(npm, log(next)));
gulp.task('browser', ['min', 'dev']);

gulp.task('min', next => webpack(browser(true), log(next)));
gulp.task('dev', next => webpack(browser(false), log(next)));

gulp.task('test', next => webpack(test, log(next)));
