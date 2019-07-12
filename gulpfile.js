const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del('lib/**', { force: true }));

gulp.task('copy', () =>
  gulp
    .src('./src/templates/server/**/*')
    .pipe(gulp.dest('./lib/templates/server')),
);
