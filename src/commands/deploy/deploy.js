'use strict';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import deployToSurge from './surge';
import deployToHeroku from './heroku';

/**
 * We're gonna deploy SPA to surge while full stack apps to Heroku
 * @returns {Promise<void>}
 */

const deployConfig = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  if (fs.existsSync(path.resolve(process.cwd(), 'server'))) {
    deployToHeroku();
  } else {
    deployToSurge();
  }
};

module.exports = deployConfig;
