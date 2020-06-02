const fs = require('fs');

/**
 * Reads the root gitignore file in the project.
 */
function readGitIgnore() {
  return fs.readFileSync('./.gitignore');
}

/**
 * Writes to .gitignore in the current project
 * whatever was in `contents`.
 *
 * @param {string} contents
 */
function writeGitIgnore(contents) {
  return fs.writeFileSync('./.gitignore', contents);
}

module.exports = {
  readGitIgnore,
  writeGitIgnore,
};
