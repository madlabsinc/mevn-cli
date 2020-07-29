'use strict';

import fs from 'fs';
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

  const projectConfig = appData();

  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  } else {
    templateDir = 'client';
  }

  // Proceed with further installation
  serveProject(projectConfig, templateDir);
};

module.exports = setupProject;
