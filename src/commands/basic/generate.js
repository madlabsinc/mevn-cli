'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import showBanner from 'node-banner';

// import appData from '../../utils/projectConfig';
import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import copyDirSync from '../../utils/fs';
import exec from '../../utils/exec';
import generateComponent from './component';
import { validateInput } from '../../utils/validate';

/**
 * Generates a new file of choice
 *
 * @returns {Promise<void>}
 */

const generateFile = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  if (!fs.existsSync('./server') || fs.existsSync('./server/models')) {
    return generateComponent();
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choose the required file to be generated',
      choices: ['Component (client)', 'CRUD Template (server)'],
    },
  ]);

  // Fetch boilerplate template used from .mevnrc
  const { template } = appData();

  if (type.includes('Component')) {
    generateComponent();
  } else {
    if (template === 'graphql') {
      // Create graphql-schema directory
      copyDirSync(
        path.join(__dirname, '..', '..', 'templates', 'graphql'),
        'server',
      );

      // Create models directory
      copyDirSync(
        path.join(__dirname, '..', '..', 'templates', 'models'),
        'server',
      );
    } else {
      // Set up routes for CRUD functionality
      const routesFilePath = `server/routes/api.js`;
      fs.writeFileSync(
        routesFilePath,
        fs.readFileSync(`${__dirname}/../../templates/routes/index.js`, 'utf8'),
      );

      // Create controllers directory
      copyDirSync(
        path.join(__dirname, '..', '..', 'templates', 'controllers'),
        'server',
      );

      // Create models directory
      copyDirSync(
        path.join(__dirname, '..', '..', 'templates', 'models'),
        'server',
      );
    }
    // Installing dependencies
    await exec(
      'npm install',
      'Installing dependencies',
      'Successfully installed the dependencies',
      {
        cwd: 'server',
      },
    );
    // Install mongoose ORM
    await exec(
      'npm install --save mongoose',
      'Installing mongoose ORM. Hold on',
      `You're all set to interact with the DB`,
      {
        cwd: 'server',
      },
    );
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
    fs.writeFileSync('./server/.env', `DB_URL=${uri}`);
  }
};

module.exports = generateFile;
