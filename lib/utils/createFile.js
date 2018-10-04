const fs = require('fs');
const showPrompt = require('./fileOverwritePrompt.js');

function createFile(fileName, contents, flag = { flag: 'a' }, cb) {
  fs.writeFile(fileName, contents, flag, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        showPrompt(fileName, (answers) => {
          if (answers.overwriteFile) {
            createFile(fileName, contents, null, cb);
          }
        });
      }
    } else {
      return cb(null, true);
    }
  });
}

module.exports = createFile;
