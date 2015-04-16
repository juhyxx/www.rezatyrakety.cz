 var gulp = require('gulp');
 var connect = require('gulp-connect');
 var open = require('gulp-open');
 var concat = require('gulp-concat');
 var sass = require('gulp-sass');
 var uglify = require('gulp-uglify');
 var sourcemaps = require('gulp-sourcemaps');
 var cssmin = require('gulp-cssmin');
 var autoprefixer = require('gulp-autoprefixer');
 var del = require('del');
 var htmlmin = require('gulp-htmlmin');
 var runSequence = require('run-sequence');
 var size = require('gulp-size');
 var fileinclude = require('gulp-file-include');
 var rev = require('gulp-rev');
 var revReplace = require('gulp-rev-replace');
 var path = require('path');

 gulp.task('watch', function () {
 	gulp.watch(['./src/styles/*.scss'], ['dist-sass', function () {
 		return gulp.src('src').pipe(connect.reload());
 	}]);

 	gulp.watch(['./src/images/*'], ['reload']);
 	gulp.watch(['./src/scripts/*'], ['dist-js', function () {
 		return gulp.src('src').pipe(connect.reload());
 	}]);

 });

 gulp.task('reload', function () {
 	return gulp.src('src').pipe(connect.reload());
 });

 gulp.task('open', function () {
 	return gulp.src('./src/index.html')
 		.pipe(open('', {
 			url: 'http://localhost:8000',
 			src: 'chrome'
 		}));
 });

 gulp.task('serve', function () {
 	return connect.server({
 		root: ['src', 'dist'],
 		port: 8000,
 		livereload: true
 	});
 });

 /** dist */
 gulp.task('clean', function () {
 	return del(['dist/*']);
 });

 gulp.task('dist-sass', function () {
 	return gulp.src(['./src/styles/*.scss'])
 		.pipe(sourcemaps.init())
 		.pipe(sass({
 			errLogToConsole: true
 		}))
 		.pipe(concat('style.min.css'))
 		.pipe(autoprefixer({
 			browsers: ['last 2 versions', 'last 2 ios versions', ],
 			cascade: false
 		}))
 		.pipe(cssmin())
 		.pipe(sourcemaps.write('map'))
 		.pipe(size({
 			title: 'CSS'
 		}))
 		.pipe(gulp.dest('./dist/styles'));
 });

 gulp.task('dist-js', function () {
 	return gulp.src(['node_modules/mustache/mustache.min.js', './src/scripts/*.js'])
 		.pipe(sourcemaps.init())
 		.pipe(concat('script.min.js'))
 		.pipe(uglify())
 		.pipe(sourcemaps.write('map'))
 		.pipe(size({
 			title: 'JS'
 		}))
 		.pipe(gulp.dest('./dist/scripts'));
 });
 gulp.task('dist-html', function () {
 	return gulp.src(['./src/index.html', './src/404.html'])
 		.pipe(fileinclude({
 			prefix: '@@',
 			basepath: '@file'
 		}))
 		.pipe(htmlmin({
 			collapseWhitespace: true,
 			keepClosingSlash: true,
 			caseSensitive: true,
 			minifyJS: true,
 			removeComments: true
 		}))

 	.pipe(size({
 			title: 'HTML'
 		}))
 		.pipe(gulp.dest('./dist'));
 });
 gulp.task('dist-images', function () {
 	return gulp.src(['src/images/**/*', 'src/*.png'], {
 			base: 'src'
 		})
 		.pipe(size({
 			title: 'IMAGES'
 		}))
 		.pipe(gulp.dest('dist'));
 });
 gulp.task('serve-dist', function () {
 	return connect.server({
 		root: ['dist'],
 		port: 8000,
 		livereload: true
 	});
 });

 gulp.task('default', ['dist-sass', 'dist-js', 'serve', 'watch', 'open']);

 gulp.task('rev', function () {
 	return gulp.src([
 			'dist/images/**/*.*',
 			'dist/scripts/**/*.js',
 			'dist/styles/**/*.css',
 			'dist/*.png'
 		], {
 			base: path.join(process.cwd(), 'dist')
 		})
 		.pipe(rev())
 		.pipe(gulp.dest('dist'))
 		.pipe(rev.manifest())
 		.pipe(gulp.dest('dist'));
 });

 gulp.task('rev-replace', function () {
 	var manifest = gulp.src('./dist/rev-manifest.json');

 	gulp.src('dist/**/*', {
 			base: 'dist'
 		})
 		.pipe(revReplace({
 			manifest: manifest
 		}))
 		.pipe(gulp.dest('dist'));
 });

 gulp.task('build', function (callback) {
 	runSequence('clean', 'dist-html', 'dist-sass', 'dist-js', 'dist-images', 'rev', 'rev-replace', callback);
 });

 gulp.task('test', function (callback) {
 	runSequence('build', 'serve-dist', callback);
 });