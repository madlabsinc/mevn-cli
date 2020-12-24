'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import showBanner from 'node-banner';

import exec from '../../utils/exec';
import generateComponent from './component';
import {
  checkIfConfigFileExists,
  copyDirSync,
  fetchProjectConfig,
  readFileContent,
} from '../../utils/helpers';
import { validateInput } from '../../utils/validate';

// Holds reference to the path where the boilerplate files reside
const templatePath = path.join(__dirname, '..', '..', 'templates');

/**
 * Creates a directory with the given name and associated boilerplate template
 *
 * @param {String} dir - Directory name
 * @returns {Void}
 */

const createDir = (dir) => {
  // Copy to destination
  copyDirSync(path.join(templatePath, dir), 'server');
};

/**
 * Generates a new file of choice
 *
 * @returns {Promise<void>}
 */

export default async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  if (
    !fs.existsSync('./server') ||
    fs.existsSync(path.join('server', 'models'))
  ) {
    return generateComponent();
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choose from below',
      choices: ['Component (client)', 'CRUD Boilerplate (server)'],
    },
  ]);

  // Fetch boilerplate template used from .mevnrc
  const projectConfig = fetchProjectConfig();
  const { template, isConfigured } = projectConfig;

  // Generate client side component
  if (type.includes('Component')) {
    return generateComponent();
  }

  // Generate CRUD boilerplate for the server
  if (template === 'GraphQL') {
    // Create graphql-schema directory
    createDir('graphql');

    // Create models directory
    createDir('models');
  } else {
    // Set up routes for CRUD functionality
    const routesFilePath = path.join('server', 'routes', 'api.js');
    fs.writeFileSync(
      routesFilePath,
      fs.readFileSync(path.join(templatePath, 'routes', 'index.js')),
    );

    // Create controllers directory
    createDir('controllers');

    // Create models directory
    createDir('models');
  }

  // Create .env file
  const { uri } = await inquirer.prompt([
    {
      type: 'input',
      name: 'uri',
      message: 'Please provide the MongoDB URI path',
      default: 'mongodb://localhost:27017',
      validate: validateInput,
    },
  ]);
  fs.writeFileSync(path.join('server', '.env'), `DB_URL=${uri}/userdb`);

  if (!isConfigured.server) {
    // Installing dependencies
    await exec(
      'npm install',
      'Installing dependencies',
      'Dependencies were successfully installed',
      {
        cwd: 'server',
      },
    );
    // .mevnrc
    projectConfig.isConfigured.server = true;
    fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));
  }

  // Install mongoose ORM
  await exec(
    'npm install --save mongoose',
    'Installing mongoose ORM. Hold on',
    `You're all set to interact with the DB`,
    {
      cwd: 'server',
    },
  );

  copyDirSync(path.join(templatePath, 'helpers'), 'server');

  const serverFilePath = path.join('server', 'server.js');
  const serverFileContent = readFileContent(serverFilePath);

  const postImportIndex = serverFileContent.findIndex((item) => item === '');
  // second occurrence
  const requiredIndex = serverFileContent.indexOf('', postImportIndex + 1);

  // Include a new line to compensate the previous addition
  serverFileContent.splice(
    requiredIndex + 1,
    0,
    'require("./helpers/db/mongodb.js")();',
    '',
  );

  fs.writeFileSync(serverFilePath, serverFileContent.join('\n'));
};
