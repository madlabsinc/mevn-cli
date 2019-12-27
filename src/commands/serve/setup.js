'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import serveProject from './launch';

/**
 * Prompts the user to choose between client/server side to be served locally
 *
 * @returns {Promise<void>}
 */

const setupProject = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  let templateDir;

  const { template } = await appData();

  // Checks if the server directory exists
  const serverDirExists = fs.existsSync(path.resolve(process.cwd(), 'server'));

  if (serverDirExists) {
    const { dir } = await inquirer.prompt({
      name: 'dir',
      type: 'list',
      message: 'Choose from below',
      choices: ['client', 'server'],
    });
    templateDir = dir;
  } else {
    templateDir = 'client';
  }

  // Navigate to the respectice directory
  process.chdir(templateDir);

  // Proceed with further installation
  serveProject(template, templateDir);
};

module.exports = setupProject;
