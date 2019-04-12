'use strict';

import fs from 'fs';
import { configFileExists } from '../utils/messages';

exports.appData = () => {
  configFileExists();
  const data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8');
  return new Promise(resolve => {
    resolve(JSON.parse(data));
  });
};
