'use strict';

import fs from 'fs';
import showBanner from 'node-banner';

import {
  checkIfConfigFileExists,
  dirOfChoice,
  fetchProjectConfig,
} from '../../utils/helpers';
import serveProject from './launch';

/**
 * Prompts the user to choose between client/server side to be served locally
 *
 * @returns {Promise<void>}
 */

export default async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  let templateDir;

  const projectConfig = fetchProjectConfig();

  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  } else {
    templateDir = 'client';
  }

  // Proceed with further installation
  serveProject(projectConfig, templateDir);
};
