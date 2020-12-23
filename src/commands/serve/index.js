'use strict';

import fs from 'fs';
import showBanner from 'node-banner';

import serveProject from './launch';
import {
  checkIfConfigFileExists,
  dirOfChoice,
  fetchProjectConfig,
} from '../../utils/helpers';

/**
 * Prompts the user to choose between client/server side to be served locally
 *
 * @returns {Promise<void>}
 */

export default async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  let templateDir = 'client';

  const projectConfig = fetchProjectConfig();

  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  }

  // Proceed with further installation
  serveProject(projectConfig, templateDir);
};
