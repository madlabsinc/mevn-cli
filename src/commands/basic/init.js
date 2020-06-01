'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
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

let projectPathRelative;
let projectConfig = {};

/**
 * Creates an initial local commit
 *
 * @returns {Void}
 */

const makeInitialCommit = () => {
  // Commands to be executed serially
  const commands = ['init', 'add .', `commit -m "Init" -m "MEVN-CLI"`];

  // Execute commands serially
  commands.forEach((cmd) =>
    execa.sync('git', cmd.split(' '), { cwd: projectPathRelative }),
  );
};

/**
 * Logs the further actions to be performed
 *
 * @returns {Void}
 */

const showInstructions = () => {
  const isCurrentDir = projectPathRelative === '.';
  let userCommandInstruction = chalk.green.bold('mevn serve');

  if (!isCurrentDir) {
    userCommandInstruction = `${chalk.green.bold(
      `cd ${projectPathRelative}`,
    )} && ${userCommandInstruction}`;
  }

  console.log();
  console.log();
  console.log(chalk.cyan.bold(`You're all set`));
  console.log(chalk.cyan.bold(`Now, just type in ${userCommandInstruction}`));

  console.log();
  console.log(
    `${chalk.yellow.bold(' Warning: ')} Do not delete the .mevnrc file`,
  );

  let removeCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
  execa.shellSync(`${removeCmd} ${path.join(projectPathRelative, '.git')}`);
  makeInitialCommit();
};

/**
 * Fetch the boilerplate template of choice
 *
 * @param {String} template - The branch which corresponds to the respective boilerplate template
 * @returns {Promise<void>}
 */

const fetchTemplate = async (templateBranch) => {
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
      projectPathRelative,
    ]);
  } catch (err) {
    fetchSpinner.fail('Something went wrong');
    throw err;
  }

  fetchSpinner.stop();

  fs.writeFileSync(
    `./${projectPathRelative}/.mevnrc`,
    JSON.stringify(projectConfig, null, 2),
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

    // Write to .mevnrc in order to keep track while installing dependencies
    if (requirePwaSupport) {
      let configFile = JSON.parse(
        fs.readFileSync(`./${projectPathRelative}/.mevnrc`),
      );
      configFile = { ...configFile, isPwa: true, isPwaConfigured: false };
      fs.writeFileSync(
        `./${projectPathRelative}/.mevnrc`,
        JSON.stringify(configFile, null, 2),
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
        .readFileSync(`./${projectPathRelative}/client/nuxt.config.js`, 'utf8')
        .toString()
        .split('\n');

      const index = configFile.indexOf(
        configFile.find((line) => line.includes('mode')),
      );
      configFile[index] = ` mode: 'universal',`;

      fs.writeFileSync(
        `./${projectPathRelative}/client/nuxt.config.js`,
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
    const source = path.join(__dirname, '..', '..', ...serverPath);
    const dest = path.resolve(projectPathRelative);

    // Copy server template directory to the destination
    copyDirSync(source, dest);

    // Rename the resultant directory to server
    const renameFromPath = path.join(dest, serverDir);
    const renameToPath = path.join(dest, 'server');
    fs.renameSync(renameFromPath, renameToPath);
  }

  // Show up initial instructions to the user
  showInstructions();
};

/**
 * Bootstrap a basic MEVN stack based webapp
 *
 * @param {String} appName - Name of the project
 * @returns {Promise<void>}
 */

const initializeProject = async (appName) => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');

  const hasMultipleProjectNameArgs =
    process.argv[4] && !process.argv[4].startsWith('-');
  const isCurrentDir = appName === '.';

  if (isCurrentDir) {
    appName = path.basename(process.cwd());
  }

  // Validation for multiple directory names
  if (hasMultipleProjectNameArgs) {
    hasStrayArgs();
  }

  const validationResult = validate(appName);
  if (!validationResult.validForNewPackages) {
    invalidProjectName(appName);
  }

  if (!isCurrentDir && fs.existsSync(appName)) {
    directoryExistsInPath(appName);
  }

  if (fs.existsSync('./.mevnrc')) {
    console.log();
    console.log(
      chalk.cyan.bold(
        ` It seems that you're already within a valid MEVN stack based project`,
      ),
    );
    process.exit(1);
  }

  projectPathRelative = isCurrentDir ? '.' : appName;

  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: 'Please select your template of choice',
      choices: ['basic', 'pwa', 'graphql', 'Nuxt-js'],
    },
  ]);

  projectConfig['name'] = appName;
  projectConfig['template'] = template;

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
