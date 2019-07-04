'use strict';

import fs from 'fs';
import showPrompt from './fileOverwritePrompt.js';

/**
 * Creates a file with the respective information as provided
 *
 * @param {String} fileName - Name of the file to be created
 * @param {String} contents - Content to be inserted
 * @param {String} flag - Mode (defaults to append)
 * @param {Function} cb - Callback function to be executed on completion
 *
 * @returns {Void}
 */

const createFile = (fileName, contents, flag = { flag: 'a' }, cb) => {
  fs.writeFile(fileName, contents, flag, err => {
    if (err) {
      if (err.code === 'EEXIST') {
        showPrompt(fileName, answers => {
          if (answers.overwriteFile) {
            createFile(fileName, contents, null, cb);
          }
        });
      }
    } else {
      return cb(null, true);
    }
  });
};

module.exports = createFile;
