'use strict';

import execa from 'execa';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import { validateInstallation } from '../../utils/validate';
import { readGitIgnore, writeGitIgnore } from '../../utils/gitignore';

/**
 * Returns the respective file content as an array
 *
 * @param {String} configFile - File whose content is to be read
 * @returns {String[]}
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
    .toString()
    .split('\n');
};

/**
 * Make data directory for mongo container to montain in order to persist
 * the database.
 *
 * @returns {void}
 */
function makeDataDir() {
  fs.mkdirSync('./tmp/data', { recursive: true });

  let gitIgnoreContents = readGitIgnore();
  const mongoGitIgnoreHeader = '# MEVN_GENERATED:MONGO';

  if (!new RegExp(mongoGitIgnoreHeader, 'g').test(gitIgnoreContents)) {
    gitIgnoreContents += ['# MEVN_GENERATED:MONGO', '/tmp', '\n'].join('\n');
  }

  writeGitIgnore(gitIgnoreContents);
}

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
  let dockerComposeTemplate = getFileContent('docker-compose.yml');
  const dockerFileTemplate = getFileContent('Dockerfile');

  // Create Dockerfile for client directory
  fs.writeFileSync('./client/Dockerfile', dockerFileTemplate.join('\n'));

  if (fs.existsSync('./server')) {
    // Create Dockerfile for the server directory
    dockerFileTemplate.splice(8, 0, 'RUN npm install -g nodemon');
    dockerFileTemplate.splice(9, 0, '');
    fs.writeFileSync('./server/Dockerfile', dockerFileTemplate.join('\n'));

    // Create .dockerignore
    fs.writeFileSync('./server/.dockerignore', 'node_modules');

    // Configure env variables for CRUD boilerplate template
    // to be consumed within the Docker container
    if (fs.existsSync('./server/models')) {
      dockerComposeTemplate.splice(14, 0, `${' '.repeat(4)}environment:`);
      dockerComposeTemplate.splice(
        15,
        0,
        `${' '.repeat(6)}- DB_URL=mongodb://mongo:27017`,
      );

      makeDataDir();
    } else {
      dockerComposeTemplate = dockerComposeTemplate.slice(0, 19);
    }
  }

  // Create .dockerignore
  fs.writeFileSync('./client/.dockerignore', 'node_modules\ndist');

  // docker-compose.yml should only include the necessary instructions
  // for the client side
  if (!fs.existsSync('./server')) {
    dockerComposeTemplate = dockerComposeTemplate.slice(0, 10);
  }

  // Create docker-compose.yml at project root
  fs.writeFileSync('docker-compose.yml', dockerComposeTemplate.join('\n'));

  try {
    await execa.shell('docker-compose up', {
      stdio: 'inherit',
    });
  } catch (err) {
    throw err;
  }
};

module.exports = dockerize;
