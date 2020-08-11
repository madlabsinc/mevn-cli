'use strict';

import execa from 'execa';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import { validateInstallation } from '../../utils/validate';

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
 * Make data directory for mongo container to mount in order to persist
 * the database.
 *
 * @returns {void}
 */
const makeDataDir = () => {
  fs.mkdirSync(path.join('tmp', 'data'), { recursive: true });

  let gitIgnoreContents = fs.readFileSync('.gitignore');
  const mongoGitIgnoreHeader = '# MEVN_GENERATED:MONGO';

  if (!new RegExp(mongoGitIgnoreHeader, 'g').test(gitIgnoreContents)) {
    gitIgnoreContents += ['\n', '# MEVN_GENERATED:MONGO', '/tmp', '\n'].join(
      '\n',
    );
  }
  // Write back the updated contents to .gitignore
  fs.writeFileSync('.gitignore', gitIgnoreContents);
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
  let dockerComposeTemplate = getFileContent('docker-compose.yml');
  const dockerFileTemplate = getFileContent('Dockerfile');

  // Create Dockerfile for client directory
  const clientDockerFilePath = path.join('client', 'Dockerfile');
  if (!fs.existsSync(clientDockerFilePath)) {
    fs.writeFileSync(clientDockerFilePath, dockerFileTemplate.join('\n'));
  }

  if (fs.existsSync('./server')) {
    // Create Dockerfile for the server directory
    dockerFileTemplate.splice(8, 0, 'RUN npm install -g nodemon');
    dockerFileTemplate.splice(9, 0, '');

    // Create Dockerfile for server directory
    const serverDockerFilePath = path.join('server', 'Dockerfile');
    if (!fs.existsSync(serverDockerFilePath)) {
      fs.writeFileSync(serverDockerFilePath, dockerFileTemplate.join('\n'));
    }

    // Create .dockerignore within server directory
    const serverDockerIgnorePath = path.join('server', '.dockerignore');
    if (!fs.existsSync(serverDockerIgnorePath)) {
      fs.writeFileSync(serverDockerIgnorePath, 'node_modules');
    }

    // Configure env variables for CRUD boilerplate template
    // to be consumed within the Docker container
    if (fs.existsSync(path.join('server', 'models'))) {
      if (!fs.existsSync(path.join('tmp', 'data'))) {
        makeDataDir();
        dockerComposeTemplate.splice(14, 0, `${' '.repeat(4)}environment:`);
        dockerComposeTemplate.splice(
          15,
          0,
          `${' '.repeat(6)}- DB_URL=mongodb://mongo:27017`,
        );
        fs.writeFileSync(
          'docker-compose.yml',
          dockerComposeTemplate.join('\n'),
        );
      }
    } else {
      dockerComposeTemplate = dockerComposeTemplate.slice(0, 19);
    }
  }

  // Create .dockerignore within client directory
  const clientDockerIgnorePath = path.join('client', '.dockerignore');
  if (!fs.existsSync(clientDockerIgnorePath)) {
    fs.writeFileSync(clientDockerIgnorePath, 'node_modules\ndist');
  }

  // docker-compose.yml should only include the necessary instructions
  // for the client side
  if (!fs.existsSync('./server')) {
    dockerComposeTemplate = dockerComposeTemplate.slice(0, 10);
  }

  // Create docker-compose.yml at project root
  if (!fs.existsSync('docker-compose.yml')) {
    fs.writeFileSync('docker-compose.yml', dockerComposeTemplate.join('\n'));
  }

  try {
    await execa.shell('docker-compose up', {
      stdio: 'inherit',
    });
  } catch (err) {
    process.exit(1);
  }
};

module.exports = dockerize;
