'use strict';
import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import deployToSurge from './surge';
import deployToHeroku from './heroku';
import dirOfChoice from '../../utils/directoryPrompt';

/**
 * Deploy the webapp to a cloud solution of choice
 * @returns {Promise<void>}
 */

const deployConfig = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Choose between client/server
  let templateDir = 'client';
  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  }

  // Deploy the Express.js webapp to Heroku
  if (templateDir === 'server') {
    deployToHeroku(templateDir);
  }

  // List the various options for client side
  if (templateDir === 'client') {
    const { platform } = await inquirer.prompt([
      {
        name: 'platform',
        type: 'list',
        message: 'Choose your preferred platform',
        choices: ['Surge', 'Heroku'],
      },
    ]);

    if (platform === 'Surge') {
      deployToSurge();
    } else {
      deployToHeroku(templateDir);
    }
  }
};

module.exports = deployConfig;
