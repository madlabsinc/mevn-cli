'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import createFile from '../../utils/createFile';
import {
  checkIfConfigFileExists,
  checkIfServerExists,
} from '../../utils/messages';
import generateComponent from './component';
import generateRoute from './routes';
import { isWin } from '../../utils/constants';
import { templateIsGraphQL } from '../../utils/messages';
import { validateInput } from '../../utils/validate';

let generatedFileContent;
let generatedFile;
let configUrl;

/**
 * Get the DB url
 *
 * @returns {Promise<void>}
 */

const getDBConfigUrl = async () => {
  const { url } = await inquirer.prompt([
    {
      name: 'url',
      type: 'input',
      message: 'Enter url for the database : ',
      validate: validateInput,
    },
  ]);
  return url;
};

/**
 * Reads the content from a given file
 *
 * @param {String} fileToGenerate - Name of the new file to be created
 * @returns {String}
 */

const getFileContent = fileToGenerate => {
  let rootPath = `${__dirname}/../../templates`;
  let filePath =
    fileToGenerate === 'model'
      ? '/models/user_schema.js'
      : '/controllers/user_controller.js';
  let fileContent = rootPath + filePath;
  return fs.readFileSync(fileContent, 'utf8');
};

/**
 * Generates a new file of choice
 *
 * @returns {Promise<void>}
 */

const generateFile = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  const { fileType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileType',
      message: 'Choose the required file to be generated',
      choices: ['component', 'config', 'model', 'route', 'controller'],
    },
  ]);

  // Fetch boilerplate template used from .mevnrc
  const { template } = await appData();

  // Defining action handlers.
  const actionHandler = {
    component: generateComponent,
    route: generateRoute,
  };

  // MVC files shouldn't be created if the template is GraphQL or else if the boilerplate lacks server directory
  if (fileType !== 'component') {
    if (template === 'graphql') {
      templateIsGraphQL();
    } else {
      await checkIfServerExists();
    }
  }

  if (['component', 'route'].indexOf(fileType) !== -1) {
    actionHandler[fileType]();
  } else {
    let workDir = fileType === 'config' ? 'config' : `${fileType}s`;
    process.chdir(`server/${workDir}`);

    let removeCmd = isWin ? 'del' : 'rm';
    if (fs.existsSync('./default.js')) {
      execa.shellSync(`${removeCmd} default.js`);
    }

    if (fileType === 'config') {
      configUrl = await getDBConfigUrl();

      const configFileContent = ['{', `  "url": "${configUrl}"`, '}'];

      generatedFileContent = configFileContent.join('\n').toString();
      generatedFile = './config.js';
    } else {
      generatedFileContent = getFileContent(fileType);
      generatedFile =
        fileType === 'controller' ? './user_controller.js' : './user_schema.js';
    }

    createFile(generatedFile, generatedFileContent, { flag: 'wx' }, err => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  }
};

module.exports = generateFile;
