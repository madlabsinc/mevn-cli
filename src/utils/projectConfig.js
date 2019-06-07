'use strict';

import fs from 'fs';
import { checkIfConfigFileExists } from '../utils/messages';

const appData = () => {
  checkIfConfigFileExists();

  const data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8');
  return new Promise(resolve => {
    resolve(JSON.parse(data));
  });
};

module.exports = appData;
