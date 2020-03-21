'use strict';

import execa from 'execa';
import fs from 'fs';

import { validateInstallation } from '../../utils/validate';

/**
 * Deploy the webapp to Heroku
 *
 * @returns {Promise<void>}
 */

const deployToHeroku = async () => {
  await Promise.all([
    validateInstallation('heroku'),
    validateInstallation('git help -g'),
  ]);

  // Navigate to the client directory
  process.chdir('client');

  if (!fs.existsSync('./git')) {
    await execa.shell('git init');
  }
};

module.exports = deployToHeroku;
