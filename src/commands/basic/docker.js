'use strict';

import execa from 'execa';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
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

  // Create .gitignore at project root
  let gitIgnoreContents = ['# MEVN_GENERATED:MONGO', '/tmp', '\n'].join('\n');
  if (fs.existsSync('.gitignore')) {
    const mongoGitIgnoreHeader = '# MEVN_GENERATED:MONGO';
    gitIgnoreContents = fs.readFileSync('.gitignore', 'utf8');

    // Early return in case .gitignore includes the respective header
    if (new RegExp(mongoGitIgnoreHeader, 'g').test(gitIgnoreContents)) {
      return;
    }
    gitIgnoreContents += ['\n', '# MEVN_GENERATED:MONGO', '/tmp', '\n'].join(
      '\n',
    );
  }
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

  // .mevnrc
  const { template } = appData();

  // Get the respective file contents
  let dockerComposeTemplate = getFileContent('docker-compose.yml');
  let dockerFileTemplate = getFileContent('Dockerfile');

  // Create Dockerfile for client directory
  const clientDockerFilePath = path.join('client', 'Dockerfile');
  if (!fs.existsSync(clientDockerFilePath)) {
    if (template === 'Nuxt.js') {
      // docker-compose.yml
      dockerComposeTemplate[4] = `${' '.repeat(
        4,
      )}command: bash -c "npm install && npm run dev"`;
      dockerComposeTemplate[9] = `${' '.repeat(6)}- "3000:3000"`;
      dockerComposeTemplate.splice(10, 0, `${' '.repeat(4)}environment:`);
      dockerComposeTemplate.splice(11, 0, `${' '.repeat(6)}HOST: 0.0.0.0`);
    }
    fs.writeFileSync(clientDockerFilePath, dockerFileTemplate.join('\n'));
  }

  if (fs.existsSync('server')) {
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

        // dockerize command was invoked after generating the CRUD boilerplate
        if (fs.existsSync('docker-compose.yml')) {
          // Content to be inserted towards the end of docker-compose.yml
          const mongoDBConfig = [
            `${' '.repeat(4)}depends_on:`,
            `${' '.repeat(6)}- mongo`,
            '',
            `${' '.repeat(2)}mongo:`,
            `${' '.repeat(4)}image: mongo`,
            `${' '.repeat(4)}volumes:`,
            `${' '.repeat(6)}- ./tmp/data:/data/db`,
            `${' '.repeat(4)}ports:`,
            `${' '.repeat(6)}- "27017:27017"`,
          ];

          // Read existing file contents
          dockerComposeTemplate = fs
            .readFileSync('docker-compose.yml', 'utf8')
            .split('\n');

          // Update docker-compose.yml file contents
          dockerComposeTemplate = [].concat(
            dockerComposeTemplate,
            mongoDBConfig,
          );
        }
        const startIdx = dockerComposeTemplate.findIndex(
          (line) => line.trim() === '- ./server:/app',
        );

        dockerComposeTemplate.splice(
          startIdx + 1,
          0,
          `${' '.repeat(4)}environment:`,
        );

        dockerComposeTemplate.splice(
          startIdx + 2,
          0,
          `${' '.repeat(6)}- DB_URL=mongodb://mongo:27017/userdb`,
        );

        // Write to docker-compose.yml
        fs.writeFileSync(
          'docker-compose.yml',
          dockerComposeTemplate.join('\n'),
        );
      }
    } else {
      const endIdx = template === 'Nuxt.js' ? 21 : 19;
      dockerComposeTemplate = dockerComposeTemplate.slice(0, endIdx);
    }
  }

  // Create .dockerignore within client directory
  const clientDockerIgnorePath = path.join('client', '.dockerignore');
  if (!fs.existsSync(clientDockerIgnorePath)) {
    const dockerIgnoreContent = 'node_modules\ndist';
    fs.writeFileSync(
      clientDockerIgnorePath,
      `${
        template === 'Nuxt.js'
          ? dockerIgnoreContent + '\n.nuxt' // Add .nuxt to .dockerignore
          : dockerIgnoreContent
      }`,
    );
  }

  // docker-compose.yml should only include the necessary instructions
  // for the client side
  if (!fs.existsSync('server')) {
    dockerComposeTemplate = dockerComposeTemplate.slice(
      0,
      template === 'Nuxt.js' ? 12 : 10,
    );
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
