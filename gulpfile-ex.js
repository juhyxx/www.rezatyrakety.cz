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
var filter = require('gulp-filter');

gulp.task('watch', function () {
	gulp.watch(['./src/**/*'], ['build', function () {
		return gulp.src('src').pipe(connect.reload());
	}]);
});

gulp.task('reload', function () {
	return gulp.src('src').pipe(connect.reload());
});

gulp.task('open', function () {
	return gulp.src('./dist/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
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
		.pipe(concat({
			path: 'style.min.css',
			cwd: ''
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rev())
		.pipe(cssmin())
		.pipe(sourcemaps.write('map'))
		.pipe(size({
			title: 'CSS'
		}))
		//.pipe(gulp.dest('./dist/styles'))
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rev.manifest({
			merge: true
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('dist-js', function () {
	return gulp.src(['node_modules/mustache/mustache.min.js', './src/scripts/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('script.min.js'))
		.pipe(rev())
		.pipe(uglify())
		.pipe(sourcemaps.write('map'))
		.pipe(size({
			title: 'JS'
		}))
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(rev.manifest({
			merge: true
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('dist-html', function () {

	return gulp.src(['./src/index.html'])
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
	return gulp.src(['./src/images/**/*'])
		.pipe(size({
			title: 'IMAGES'
		}))
		.pipe(rev())
		.pipe(gulp.dest('./dist/images/'))
		.pipe(rev.manifest({
			merge: true
		}))
		.pipe(gulp.dest('./dist'));
});
gulp.task('serve-dist', function () {
	return connect.server({
		root: ['dist'],
		port: 8000,
		livereload: true
	});
});

gulp.task('rev', function () {
	return gulp.src(['dist/styles/*.css', 'scripts/*.js', 'images/*'])
		.pipe(rev())
		.pipe(gulp.dest('dist')) // write rev'd assets to build dir
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist')); // write manifest to build dir
});

gulp.task('replace', function () {
	var manifest = gulp.src('./dist/rev-manifest.json');
	gulp.src(['dist/**/*'])
		.pipe(revReplace({
			manifest: manifest
		}))
		.pipe(gulp.dest('dist'));

});

gulp.task('build2', ['clean'], function () {
	del.sync('dist/*');
	var jsFilter = filter('**/*.js');
	var scssFilter = filter('**/*.scss');

	gulp.src(['src/**/*', 'node_modules/mustache/mustache.min.js'])

	.pipe(scssFilter)
		.pipe(sourcemaps.init())
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat({
			path: 'styles/style.min.css',
			cwd: ''
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rev())
		.pipe(cssmin())
		.pipe(sourcemaps.write('map'))
		.pipe(size({
			title: 'CSS'
		}))
		.pipe(scssFilter.restore())
		/*js*/

	.pipe(jsFilter)
		.pipe(sourcemaps.init())
		.pipe(concat('script.min.js'))
		.pipe(rev())
		.pipe(uglify())
		.pipe(sourcemaps.write('map'))
		.pipe(size({
			title: 'JS'
		}))
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(rev.manifest({
			merge: true
		}))
		.pipe(jsFilter.restore())

	.pipe(gulp.dest('dist'));

});

gulp.task('default', ['build', 'watch', 'serve-dist', 'open']);

gulp.task('build', function (callback) {
	runSequence('clean', 'dist-sass', 'dist-js', 'dist-images', 'dist-html', 'replace', callback);
});

gulp.task('test', function (callback) {
	runSequence('build', 'serve-dist', callback);
});