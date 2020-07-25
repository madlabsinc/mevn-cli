const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del('lib/**', { force: true }));

gulp.task('copy server templates', () =>
  gulp
    .src('./src/templates/server/**/*')
    .pipe(gulp.dest('./lib/templates/server')),
);

gulp.task('copy starter templates', () =>
  gulp
    .src('./src/templates/starter-templates/**/*')
    .pipe(gulp.dest('./lib/templates/starter-templates')),
);

gulp.task(
  'copy',
  gulp.series('copy server templates', 'copy starter templates'),
);
