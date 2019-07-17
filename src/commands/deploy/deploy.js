'use strict';
import fs from 'fs';
import path from 'path';

import deployToSurge from './surge';
import deployToHeroku from './heroku';

/**
 * We're gonna deploy SPA to surge while full stack apps to Heroku
 * @returns {Void}
 */

const deployConfig = () => {
  if (fs.existsSync(path.resolve(process.cwd(), 'server'))) {
    deployToHeroku();
  } else {
    deployToSurge();
  }
};

module.exports = deployConfig;
