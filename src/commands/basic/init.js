'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import Table from 'cli-table3';
import validate from 'validate-npm-package-name';

import copyDirSync from '../../utils/fs';
import { isWin } from '../../utils/constants';
import {
  directoryExistsInPath,
  hasStrayArgs,
  invalidProjectName,
} from '../../utils/messages';
import Spinner from '../../utils/spinner';
import { validateInstallation } from '../../utils/validate';

let availableCommands = new Table();

let projectName;
let projectConfig;

/**
 * Creates an initial local commit
 *
 * @returns {Promise<void>}
 */

const makeInitialCommit = async () => {
  process.chdir(projectName);
  await execa('git', ['init']);
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', 'Initial commit', '-m', 'From Mevn-CLI']);
};

/**
 * Shows the list of available commands
 *
 * @returns {Void}
 */

const showCommandsList = () => {
  console.log();
  console.log(chalk.yellow(' Available commands:-'));

  availableCommands.push(
    {
      'mevn init': 'To bootstrap a MEVN webapp',
    },
    {
      'mevn serve': 'To launch client/server',
    },
    {
      'mevn add:package': 'Add additional packages',
    },
    {
      'mevn generate': 'To generate config files',
    },
    {
      'mevn codesplit <name>': 'Lazy load components',
    },
    {
      'mevn dockerize': 'Launch within docker containers',
    },
    {
      'mevn deploy': 'Deploy the app to Heroku',
    },
    {
      'mevn info': 'Prints local environment information',
    },
  );
  console.log(availableCommands.toString());

  console.log();
  console.log();
  console.log(
    chalk.cyanBright(
      ` Make sure that you've done ${chalk.greenBright(`cd ${projectName}`)}`,
    ),
  );

  console.log();
  console.log(
    `${chalk.yellow.bold(' Warning: ')} Do not delete the mevn.json file`,
  );

  let removeCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
  execa.shellSync(`${removeCmd} ${path.join(projectName, '.git')}`);
  makeInitialCommit();
};

/**
 * Fetch the boilerplate template of choice
 *
 * @param {String} template - The branch which corresponds to the respective boilerplate template
 * @returns {Promise<void>}
 */

const fetchTemplate = async templateBranch => {
  await validateInstallation('git help -g');

  // Boilerplate templates are available within a single repository
  const repoUrl = 'https://github.com/madlabsinc/mevn-starter-templates';

  const fetchSpinner = new Spinner('Fetching the boilerplate template');
  fetchSpinner.start();
  try {
    await execa('git', [
      'clone',
      repoUrl,
      '--branch',
      templateBranch,
      '--single-branch',
      projectName,
    ]);
  } catch (err) {
    fetchSpinner.fail('Something went wrong');
    throw err;
  }

  fetchSpinner.stop();

  fs.writeFileSync(
    `./${projectName}/mevn.json`,
    projectConfig.join('\n').toString(),
  );

  // Prompt the user whether he/she requires pwa support
  if (templateBranch === 'nuxt') {
    const { requirePwaSupport } = await inquirer.prompt([
      {
        name: 'requirePwaSupport',
        type: 'confirm',
        message: 'Do you require pwa support',
      },
    ]);

    // Write to mevn.json in order to keep track while installing dependencies
    if (requirePwaSupport) {
      let configFile = JSON.parse(
        fs.readFileSync(`./${projectName}/mevn.json`).toString(),
      );
      configFile['isPwa'] = true;
      fs.writeFileSync(
        `./${projectName}/mevn.json`,
        JSON.stringify(configFile),
      );
    }

    // Choose between Universal/SPA mode
    const { mode } = await inquirer.prompt([
      {
        name: 'mode',
        type: 'list',
        message: 'Choose your preferred mode',
        choices: ['Universal', 'SPA'],
      },
    ]);

    // Update the config file (nuxt.config.js)
    if (mode === 'Universal') {
      let configFile = fs
        .readFileSync(`./${projectName}/client/nuxt.config.js`, 'utf8')
        .toString()
        .split('\n');

      const index = configFile.indexOf(
        configFile.find(line => line.includes('mode')),
      );
      configFile[index] = ` mode: 'universal',`;

      fs.writeFileSync(
        `./${projectName}/client/nuxt.config.js`,
        configFile.join('\n'),
      );
    }
  }

  // Show up a suitable prompt whether if the user requires a Full stack application (Express.js)
  const { requireServer } = await inquirer.prompt({
    name: 'requireServer',
    type: 'confirm',
    message: 'Do you require server side template (Express.js)',
  });

  // Copy server side template files to the destination as required
  if (requireServer) {
    // Configure path
    const serverDir = templateBranch === 'graphql' ? 'GraphQL' : 'basic';
    const serverPath = ['templates', 'server', serverDir];
    const source = path.resolve(__dirname, '..', '..', ...serverPath);
    const dest = path.resolve(process.cwd(), projectName);

    // Copy server template directory to the destination
    copyDirSync(source, dest);

    // Rename the resultant directory to server
    const renameFromPath = path.join(dest, serverDir);
    const renameToPath = path.join(dest, 'server');
    fs.renameSync(renameFromPath, renameToPath);
  }
  showCommandsList();
};

/**
 * Bootstrap a basic MEVN stack based webapp
 *
 * @param {String} appName - Name of the project
 * @returns {Promise<void>}
 */

const initializeProject = async appName => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');

  const hasMultipleProjectNameArgs =
    process.argv[4] && !process.argv[4].startsWith('-');

  // Validation for multiple directory names
  if (hasMultipleProjectNameArgs) {
    hasStrayArgs();
  }

  const validationResult = validate(appName);
  if (!validationResult.validForNewPackages) {
    invalidProjectName(appName);
  }

  if (fs.existsSync(appName)) {
    directoryExistsInPath(appName);
  }

  projectName = appName;

  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: 'Please select your template of choice',
      choices: ['basic', 'pwa', 'graphql', 'Nuxt-js'],
    },
  ]);

  projectConfig = [
    '{',
    `"name": "${appName}",`,
    `"template": "${template}"`,
    '}',
  ];
  // Holds GitHub repo branch corresponding to the respective boilerplate template
  let templateBranch = template;

  if (template === 'basic') {
    templateBranch = 'master';
  } else if (template === 'Nuxt-js') {
    templateBranch = 'nuxt';
  }

  fetchTemplate(templateBranch);
};

module.exports = initializeProject;
