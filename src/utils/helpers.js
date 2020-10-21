const fs = require('fs');

const { isWin } = require('./constants');

/**
 * Strips \r character from the file content if the host OS is windows
 *
 * @param {String[]} fileContent - The file content
 * @returns {String[]}
 */

const stripChar = (fileContent) =>
  fileContent.map((content) =>
    content.includes('\r') ? content.substr(0, content.indexOf('\r')) : content,
  );
/**
 * Returns the file content as an arrray
 *
 * @param {String} filePath - The file path
 * @returns {String[]}
 */

const readFileContent = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8').split('\n');

  // Check if the host OS is windows
  if (isWin) {
    return stripChar(fileContent);
  }
  return fileContent;
};

module.exports = readFileContent;
