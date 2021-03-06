const gulp = require('gulp');
const replace = require('gulp-replace');
const hasha = require('hasha');

gulp.task('cachebust', ['copy', 'styles', 'scripts'], () => {
  gulp.src(['src/**/*.{html,js}'])
      .pipe(replace('@@data-json', hasha.fromFileSync('dist/data/data.json')))
      .pipe(replace('@@colors-json', hasha.fromFileSync('dist/data/colors.json')))
      .pipe(replace('@@main-css', hasha.fromFileSync('dist/css/main.min.css')))
      .pipe(replace('@@lib-css', hasha.fromFileSync('dist/css/lib.min.css')))
      .pipe(replace('@@main-js', hasha.fromFileSync('dist/js/main.min.js')))
      .pipe(gulp.dest('dist'));
});
