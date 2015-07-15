let gulp = require('gulp'),
	babel = require('gulp-babel'),
	b = require('browserify'),
	babelify = require('babelify'),
	uglifyify = require('uglifyify'),
	source = require('vinyl-source-stream');

let src = './src/**/*.js';

gulp.task('default', ['watch']);
gulp.task('watch', () => gulp.watch(src, 'build'));
gulp.task('build', ['npm', 'browser']);

gulp.task('npm', () =>
	gulp.src(src)
		.pipe(babel())
		.pipe(gulp.dest('./lib'))
);

gulp.task('browser', ['min', 'dev']);

gulp.task('min', () =>
	b({ entries: './src/index.js', standalone: 'fluxette' })
		.transform(babelify)
		.transform(uglifyify)
		.external('react')
		.bundle()
		.pipe(source('fluxette.min.js'))
		.pipe(gulp.dest('./dist'))
);


gulp.task('dev', () =>
	b({ entries: './src/index.js', standalone: 'fluxette' })
		.transform(babelify)
		.external('react')
		.bundle()
		.pipe(source('fluxette.js'))
		.pipe(gulp.dest('./dist'))
);
