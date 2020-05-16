'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';

// import appData from '../../utils/projectConfig';
import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import exec from '../../utils/exec';
import generateComponent from './component';

/**
 * Generates a new file of choice
 *
 * @returns {Promise<void>}
 */

const generateFile = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  if (!fs.existsSync('./server')) {
    return generateComponent();
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choose the required file to be generated',
      choices: ['component (client)', 'CRUD Template (server)'],
    },
  ]);

  // Fetch boilerplate template used from .mevnrc
  const { template } = appData();

  if (type.includes('component')) {
    generateComponent();
  } else {
    if (template === 'graphql') {
      // TODO
    } else {
      // Set up routes for CRUD functionality
      const routesFilePath = `server/routes/api.js`;
      fs.writeFileSync(
        routesFilePath,
        fs.readFileSync(`${__dirname}/../../templates/routes/index.js`, 'utf8'),
      );

      // Create controllers directory
      const controllersDirPath = `server/controllers`;
      fs.mkdirSync(controllersDirPath);
      fs.writeFileSync(
        `${controllersDirPath}/user_controller.js`,
        fs.readFileSync(
          `${__dirname}/../../templates/controllers/user_controller.js`,
          'utf8',
        ),
      );

      // Create models directory
      const modelsDirPath = `server/models`;
      fs.mkdirSync(modelsDirPath);
      fs.writeFileSync(
        `${modelsDirPath}/user_schema.js`,
        fs.readFileSync(
          `${__dirname}/../../templates/models/user_schema.js`,
          'utf8',
        ),
      );

      await exec(
        'npm install --save mongoose',
        'Installing dependencies. Hold on',
      );
    }
  }
};

module.exports = generateFile;
