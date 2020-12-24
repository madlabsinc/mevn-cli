const del = require('del');
const execa = require('execa');
const gulp = require('gulp');

gulp.task('clean', () => del('lib/**'));

gulp.task('build', async () => {
  const {
    exitCode,
  } = await execa.command(
    'babel src --out-dir lib --copy-files --include-dotfiles',
    { stdio: 'inherit' },
  );
  console.log(`The process exited with code ${exitCode}`);
});

gulp.task('cleanup', () => del('lib/**/__tests__'));

gulp.task('default', gulp.series('clean', 'build', 'cleanup'));
