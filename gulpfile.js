let gulp = require('gulp'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass');

function tildaResolver(url, prev, done) {
  if (url[0] === '~') {
    url = path.resolve('node_modules', url.substr(1));
  }
  return {file: url};
}

let destination = 'build';

gulp.task('css', function () {
  return gulp.src(['styles/styles.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({importer: tildaResolver}).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
});

gulp.task('fonts', function () {
  return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/*.woff'])
    .pipe(gulp.dest('fonts'))
});

gulp.task('watch', gulp.series('css', function watch() {
  return gulp.watch([
    'styles/**/*.scss'
  ], gulp.series('css'))
}));

gulp.task('default', gulp.series('css', 'fonts'));
