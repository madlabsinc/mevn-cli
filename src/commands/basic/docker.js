'use strict';

import execa from 'execa';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import { isWin } from '../../utils/constants';
import { validateInstallation } from '../../utils/validate';

/**
 * Returns the respective file content
 *
 * @param {String} configFile - File whose content is to be read
 * @returns {String}
 */

const getFileContent = (configFile) => {
  // Holds reference to the path where docker-config files reside
  const dockerConfigTemplatePath = path.join(
    __dirname,
    '..',
    '..',
    'templates',
    'docker',
  );
  return fs
    .readFileSync(path.join(dockerConfigTemplatePath, configFile))
    .toString();
};

/**
 * Launch multiple containers with docker-compose (client, server and mongo client)
 *
 * @returns {Promise<void>}
 */

const dockerize = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();
  await validateInstallation('docker');

  // Get the respective file contents
  let dockerComposeTemplate = getFileContent('docker-compose.yml').split('\n');
  const dockerFileTemplate = getFileContent('Dockerfile');

  if (fs.existsSync('./server')) {
    // Create Dockerfile for the server directory
    fs.writeFileSync('./server/Dockerfile', dockerFileTemplate);
    // Create .dockerignore
    fs.writeFileSync('./server/.dockerignore', 'node_modules');
    // docker-compose.yml
    if (!fs.existsSync('./server/models')) {
      dockerComposeTemplate = dockerComposeTemplate.slice(0, 19);
    }
  }

  // Create Dockerfile for client directory
  fs.writeFileSync('./client/Dockerfile', dockerFileTemplate);
  // Create .dockerignore
  fs.writeFileSync('./client/.dockerignore', 'node_modules\ndist');
  // docker-compose.yml should only include the necessary instructions for the client side
  if (!fs.existsSync('./server')) {
    dockerComposeTemplate = dockerComposeTemplate.slice(0, 10);
  }

  // Create docker-compose.yml at project root
  fs.writeFileSync('docker-compose.yml', dockerComposeTemplate.join('\n'));

  try {
    // Requires administrative (super-user) privilege
    // Sets up the environment by pulling required images as in the config file
    await execa.shell(`${isWin ? '' : 'sudo'} docker-compose up`, {
      stdio: 'inherit',
    });
  } catch (err) {
    throw err;
  }
};

module.exports = dockerize;
