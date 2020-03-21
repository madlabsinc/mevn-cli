'use strict';
import inquirer from 'inquirer';
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
    deployToHeroku();
  }
};

module.exports = deployConfig;
