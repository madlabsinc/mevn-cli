'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import validate from 'validate-npm-package-name';

import * as logger from '../../utils/logger';
import {
  copyDirSync,
  getAvailablePackageManagers,
  readFileContent,
} from '../../utils/helpers';
import { validateInstallation } from '../../utils/validate';

let projectPathRelative;
const projectConfig = {};

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
  logger.info(`You're all set`);
  logger.info(`Now, just type in ${userCommandInstruction}`);

  makeInitialCommit();
};

/**
 * Fetch the boilerplate template of choice
 *
 * @param {String} template - The boilerplate template of choice
 * @returns {Promise<void>}
 */

const fetchTemplate = async (template) => {
  await validateInstallation('git help -g');

  // Holds reference to the destination path
  const dest = path.resolve(projectPathRelative);

  // Holds reference to the path where starter templates reside
  const templatePath = path.join(
    __dirname,
    '..',
    '..',
    'templates',
    'starter-templates',
  );

  // Copy the starter template to user's current working directory
  copyDirSync(path.join(templatePath, template), dest);

  // Rename the resultant directory to client
  const renameFromPath = path.join(dest, template);
  const renameToPath = path.join(dest, 'client');
  fs.renameSync(renameFromPath, renameToPath);

  // Rename to .gitignore
  fs.renameSync(
    path.join(renameToPath, '.mevngitignore'),
    path.join(renameToPath, '.gitignore'),
  );

  // Prompt the user whether he/she requires pwa support
  if (template === 'Nuxt.js') {
    const configFilePath = path.join(
      projectPathRelative,
      'client',
      'nuxt.config.js',
    );
    const configFile = readFileContent(configFilePath);

    // Choose the rendering mode
    const { mode } = await inquirer.prompt([
      {
        name: 'mode',
        type: 'list',
        message: 'Rendering mode',
        choices: ['Universal (SSR/SSG)', 'Single Page App'],
      },
    ]);

    // Update the config file (nuxt.config.js)
    if (mode === 'Single Page App') {
      const modeIdx = configFile.findIndex((line) => line.includes('ssr:'));
      configFile[modeIdx] = `${' '.repeat(2)}ssr: false,`;
    }

    // Choose the Deployment target
    const { deployTarget } = await inquirer.prompt([
      {
        name: 'deployTarget',
        type: 'list',
        message: 'Deployment target',
        choices: ['Node.js hosting', 'Static (Static/JAMStack hosting)'],
      },
    ]);

    if (deployTarget === 'Node.js hosting') {
      const targetIdx = configFile.findIndex((line) =>
        line.includes('target:'),
      );
      configFile[targetIdx] = `${' '.repeat(2)}target: 'server',`;
    }

    // To be written to project specific config (.mevnrc)
    projectConfig.modules = [];
    projectConfig.renderingMode = mode.includes('Universal')
      ? 'universal'
      : 'spa';
    projectConfig.deployTarget = deployTarget.includes('Node.js')
      ? 'server'
      : 'static';

    // Write back the updated config file (nuxt.config.js)
    fs.writeFileSync(configFilePath, configFile.join('\n'));
  }

  // Keep track whether dependencies are to be installed
  projectConfig.isConfigured = {
    client: false,
  };

  // Show up a suitable prompt whether if the user requires a Full stack application (Express.js)
  const { requireServer } = await inquirer.prompt({
    name: 'requireServer',
    type: 'confirm',
    message: 'Do you require server side template (Express.js)',
  });

  // Copy server side template files to the destination as required
  if (requireServer) {
    // Configure path
    const serverDir = template === 'GraphQL' ? 'GraphQL' : 'Default';
    const serverPath = ['templates', 'server', serverDir];
    const source = path.join(__dirname, '..', '..', ...serverPath);
    const dest = path.resolve(projectPathRelative);

    // Keep track whether dependencies are to be installed
    projectConfig.isConfigured = {
      client: false,
      server: false,
    };

    // Copy server template directory to the destination
    copyDirSync(source, dest);

    // Rename the resultant directory to server
    const renameFromPath = path.join(dest, serverDir);
    const renameToPath = path.join(dest, 'server');
    fs.renameSync(renameFromPath, renameToPath);

    fs.writeFileSync(path.join(renameToPath, '.gitignore'), 'node_modules');
  }

  const availablePackageManagers = getAvailablePackageManagers();

  // Default package manager
  projectConfig.packageManager = availablePackageManagers[0];

  // Check if multiple package managers are available
  if (availablePackageManagers.length > 1) {
    const { packageManager } = await inquirer.prompt({
      name: 'packageManager',
      type: 'list',
      message: 'Pick a package manager',
      choices: availablePackageManagers,
    });

    // Keep track of the package manager of choice
    projectConfig.packageManager = packageManager;
  }

  // Update project specific config file
  fs.writeFileSync(
    path.join(projectPathRelative, '.mevnrc'),
    JSON.stringify(projectConfig, null, 2),
  );

  // Show up initial instructions to the user
  showInstructions();
};

/**
 * Scaffolds a MEVN stack based webapp
 *
 * @param {String} appName - Name of the project
 * @returns {Promise<void>}
 */

export default async (appName) => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');

  const hasMultipleProjectNameArgs =
    process.argv[4] && !process.argv[4].startsWith('-');

  let isCurrentDir = false;
  if (appName === '.') {
    isCurrentDir = true;
    appName = path.basename(process.cwd());
  }

  // Validation for multiple directory names
  if (hasMultipleProjectNameArgs) {
    logger.error(
      '\n Error: Kindly provide only one argument as the directory name!!',
    );
    process.exit(1);
  }

  const { validForNewPackages } = validate(appName);
  if (!validForNewPackages) {
    logger.error(
      ` Error: Could not create a project called "${chalk.cyan.bold(
        appName,
      )}" because of npm naming restrictions:`,
    );
    process.exit(1);
  }

  if (isCurrentDir) {
    if (fs.readdirSync('.').length) {
      logger.error(`\n It seems the current directory isn't empty.\n`);
      process.exit(1);
    }
  }

  if (!isCurrentDir && fs.existsSync(appName)) {
    logger.error(
      `\n Error: Directory ${chalk.cyan.bold(appName)} already exists in path!`,
    );
    process.exit(1);
  }

  if (fs.existsSync('.mevnrc')) {
    logger.error(
      `\n It seems that you're already within a valid MEVN stack based project`,
    );
    process.exit(1);
  }

  projectPathRelative = isCurrentDir ? '.' : appName;

  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: 'Please choose a starter template',
      choices: ['Default', 'PWA (Progressive Web App)', 'GraphQL', 'Nuxt.js'],
    },
  ]);

  // Create a directory in the current path with the given name
  if (!isCurrentDir) {
    fs.mkdirSync(appName);
  }

  projectConfig['name'] = appName;
  projectConfig['template'] = template.includes('PWA') ? 'PWA' : template;

  fetchTemplate(projectConfig.template);
};
