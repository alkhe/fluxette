let gulp = require('gulp'),
	babel = require('gulp-babel'),
	webpack = require('webpack'),
	wf = require('../webpack.factory');

let src = './src/**/*.js';

let wlogger = (err, stats) => {
	if (err) {
		throw new Error(err);
	}
	console.log(stats.toString());
};

gulp.task('default', ['watch']);
gulp.task('watch', () => gulp.watch(src, 'build'));
gulp.task('build', ['npm', 'browser']);

gulp.task('npm', () =>
	gulp.src(src)
		.pipe(babel())
		.pipe(gulp.dest('./lib'))
);

gulp.task('browser', ['min', 'dev']);

gulp.task('min', () => webpack(wf.build(true, 'fluxette.min.js'), wlogger));
gulp.task('dev', () => webpack(wf.build(false, 'fluxette.js'), wlogger));

gulp.task('test', () => webpack(wf.test(), wlogger));
