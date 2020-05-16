'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';

// import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import generateComponent from './component';

/**
 * Generates a new file of choice
 *
 * @returns {Promise<void>}
 */

const generateFile = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  if (!fs.existsSync('./server')) {
    return generateComponent();
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choose the required file to be generated',
      choices: ['component (client)', 'MVC Template (server)'],
    },
  ]);

  // Fetch boilerplate template used from .mevnrc
  // const { template } = appData();

  if (type === 'component') {
    generateComponent();
  } else {
    // TODO
  }
};

module.exports = generateFile;
