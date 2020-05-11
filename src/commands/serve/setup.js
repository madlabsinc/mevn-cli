'use strict';

import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import dirOfChoice from '../../utils/directoryPrompt';
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

  const { template } = appData();

  // Checks if the server directory exists
  const serverDirExists = fs.existsSync(path.resolve(process.cwd(), 'server'));

  if (serverDirExists) {
    const { dir } = await dirOfChoice();
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
