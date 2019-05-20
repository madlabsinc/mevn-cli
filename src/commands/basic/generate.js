'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';

import { appData } from '../../utils/projectConfig';
import { createFile } from '../../utils/createFile';
import { checkIfConfigFileExists } from '../../utils/messages';
import { generateComponent } from './component';
import { generateRoute } from './routes';
import { showBanner } from '../../external/banner';
import { templateIsGraphQL } from '../../utils/messages';

let generatedFileContent;
let generatedFile;
let configUrl;

const getDBConfigUrl = async () => {
  await inquirer
    .prompt([
      {
        name: 'url',
        type: 'input',
        message: 'Enter the url for the database : ',
      },
    ])
    .then(dbConfig => {
      configUrl = dbConfig.url;
    });
};

const getFileContent = fileToGenerate => {
  let rootPath = `${__dirname}/../../templates`;
  let filePath =
    fileToGenerate === 'model'
      ? '/models/user_schema.js'
      : '/controllers/user_controller.js';
  let fileContent = rootPath + filePath;
  return fs.readFileSync(fileContent, 'utf8');
};

exports.generateFile = async () => {
  await showBanner();
  checkIfConfigFileExists();

  await appData().then(data => {
    if (data.template === 'graphql') {
      templateIsGraphQL();
    }
  });

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'file',
        message: 'Choose the required file to be generated',
        choices: ['component', 'config', 'model', 'route', 'controller'],
      },
    ])
    .then(async userChoice => {
      // Defining action handlers.
      const actionHandler = {
        component: generateComponent,
        route: generateRoute,
      };

      if (userChoice.file === 'component' || userChoice.file === 'route') {
        actionHandler[userChoice.file]();
      } else {
        let workDir =
          userChoice.file === 'config' ? 'config' : `${userChoice.file}s`;
        process.chdir(`server/${workDir}`);

        let removeCmd = os.type() === 'Windows_NT' ? 'del' : 'rm';
        if (fs.existsSync('./default.js')) {
          execa.shellSync(`${removeCmd} default.js`);
        }

        if (userChoice.file === 'config') {
          await getDBConfigUrl();

          const configFileContent = ['{', `  "url": "${configUrl}"`, '}'];

          generatedFileContent = configFileContent.join('\n').toString();
          generatedFile = './config.js';
        } else {
          generatedFileContent = getFileContent(userChoice.file);
          generatedFile =
            userChoice.file === 'controller'
              ? './user_controller.js'
              : './user_schema.js';
        }

        createFile(generatedFile, generatedFileContent, { flag: 'wx' }, err => {
          if (err) throw err;
          console.log(chalk.yellow('File Created...!'));
        });
      }
    });
};
