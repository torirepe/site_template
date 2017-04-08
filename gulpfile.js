var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var csscomb = require('gulp-csscomb');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var cache = require('gulp-cached');

var destDir = 'public/';
var assetsDir = 'common/';

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: destDir
		}
	});
});
gulp.task('sass', function () {
	return gulp.src(['resource/' + assetsDir + 'sass/**/*.scss'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Android 3', 'ie 9']
		}))
		.pipe(csscomb())
		.pipe(gulp.dest('resource/' + assetsDir + 'css/'))
});
gulp.task('css', function () {
	return gulp.src('resource/**/*.css')
		.pipe(cache('css-cache'))
		.pipe(gulp.dest(destDir))
		.pipe(browserSync.stream())
});
gulp.task('jsmin', function () {
	gulp.src(['resource/' + assetsDir + 'js/**/*.js',
    '!resource/' + assetsDir + 'js/**/*.min.js'])
		.pipe(plumber())
		.pipe(changed(destDir + assetsDir + 'js/'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('resource/' + assetsDir + 'js/'))
});
gulp.task('js', function () {
	return gulp.src('resource/**/*.js')
		.pipe(cache('js-cache'))
		.pipe(gulp.dest(destDir))
		.pipe(browserSync.stream())
});
gulp.task('copyResource', function () {
	return gulp.src(['resource/**/*', '!resource/' + assetsDir + 'sass/', '!resource/' + assetsDir + 'sass/*.scss'])
		.pipe(cache('resource-cache'))
		.pipe(gulp.dest(destDir))
		.pipe(browserSync.stream())
});
gulp.task('default', ['browser-sync', 'copyResource', 'sass', 'jsmin'], function () {
	watch(['resource/**/*.+(jpg|jpeg|gif|png|html|php)'], function (event) {
		gulp.start(['copyResource']);
	});
	watch(['resource/**/*.scss'], function (event) {
		gulp.start(['sass']);
	});
	watch(['resource/**/*.css'], function (event) {
		gulp.start(['css']);
	});
	watch(['resource/**/*.js'], function (event) {
		gulp.start(['jsmin']);
	});
	watch(['resource/**/*.min.js'], function (event) {
		gulp.start(['js']);
	});
});
