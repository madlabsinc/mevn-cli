'use strict';

import fs from 'fs';
import { showPrompt } from './fileOverwritePrompt.js';

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

Object.assign(exports, {
  createFile,
});
