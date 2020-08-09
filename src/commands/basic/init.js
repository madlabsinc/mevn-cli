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

  let removeCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
  execa.shellSync(`${removeCmd} ${path.join(projectPathRelative, '.git')}`);
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

  // rename the resultant directory to client
  const renameFromPath = path.join(dest, template);
  const renameToPath = path.join(dest, 'client');
  fs.renameSync(renameFromPath, renameToPath);

  // Prompt the user whether he/she requires pwa support
  if (template === 'Nuxt.js') {
    const configFile = fs
      .readFileSync(`./${projectPathRelative}/client/nuxt.config.js`, 'utf8')
      .toString()
      .split('\n');

    // Choose the Nuxt.js modules to install
    const { modules } = await inquirer.prompt([
      {
        name: 'modules',
        type: 'checkbox',
        message: 'Nuxt.js modules',
        choices: ['Axios', 'Progressive Web App (PWA)', 'Content'],
      },
    ]);

    // Add 2 so that the content gets inserted at the right position
    const buildModulesIdx =
      configFile.findIndex((line) => line.includes('buildModules:')) + 2;

    const modulesIdx =
      configFile.findIndex((line) => line.includes('modules:')) + 2;

    projectConfig.modules = [];

    // Configure @nuxtjs/axios module
    if (modules.includes('Axios')) {
      const axiosConfig = [
        `${' '.repeat(2)}axios: {`,
        `${' '.repeat(4)}// proxyHeaders: false`,
        `${' '.repeat(2)}},`,
      ];
      projectConfig.modules.push('axios');
      configFile.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/axios',`);

      // Add 1 so that the content gets inserted after the modules array
      const modulesEndIdx =
        configFile.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

      // Add @nuxtjs/axios config beneath the modules array
      axiosConfig.forEach((config, idx) =>
        configFile.splice(modulesEndIdx + idx, 0, config),
      );
    }

    // Configure @nuxtjs/pwa module
    if (modules.includes('Progressive Web App (PWA)')) {
      projectConfig.modules.push('pwa');
      configFile.splice(buildModulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/pwa',`);
    }

    // Configure @nuxtjs/content module
    if (modules.includes('Content')) {
      const contentConfig = [
        `${' '.repeat(2)}content: {`,
        `${' '.repeat(4)} //Options`,
        `${' '.repeat(2)}},`,
      ];
      projectConfig.modules.push('content');
      configFile.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxt/content',`);

      const modulesEndIdx =
        configFile.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

      // Add @nuxtjs/content config beneath the modules array
      contentConfig.forEach((config, idx) =>
        configFile.splice(modulesEndIdx + idx, 0, config),
      );
    }

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
    if (mode.includes('Universal')) {
      const modeIdx = configFile.findIndex((line) => line.includes('mode:'));
      configFile[modeIdx] = ` mode: 'universal',`;
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
    projectConfig.renderingMode = mode.includes('Universal')
      ? 'universal'
      : 'spa';
    projectConfig.deployTarget = deployTarget.includes('Node.js')
      ? 'server'
      : 'static';

    // Keep track whether the Nuxt.js modules are configured
    projectConfig.isConfigured = false;

    // Write back the updated config file (nuxt.config.js)
    fs.writeFileSync(
      `./${projectPathRelative}/client/nuxt.config.js`,
      configFile.join('\n'),
    );
  }

  // Update project specific config file
  fs.writeFileSync(
    `./${projectPathRelative}/.mevnrc`,
    JSON.stringify(projectConfig, null, 2),
  );

  // Show up a suitable prompt whether if the user requires a Full stack application (Express.js)
  const { requireServer } = await inquirer.prompt({
    name: 'requireServer',
    type: 'confirm',
    message: 'Do you require server side template (Express.js)',
  });

  // Copy server side template files to the destination as required
  if (requireServer) {
    // Configure path
    const serverDir = template === 'GraphQL' ? 'GraphQL' : 'basic';
    const serverPath = ['templates', 'server', serverDir];
    const source = path.join(__dirname, '..', '..', ...serverPath);
    const dest = path.resolve(projectPathRelative);

    // Copy server template directory to the destination
    copyDirSync(source, dest);

    // Rename the resultant directory to server
    const renameFromPath = path.join(dest, serverDir);
    const renameToPath = path.join(dest, 'server');
    fs.renameSync(renameFromPath, renameToPath);

    fs.writeFileSync(`${renameToPath}/.gitignore`, 'node_modules');
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

  let isCurrentDir = false;
  if (appName === '.') {
    isCurrentDir = true;
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

  if (isCurrentDir) {
    if (fs.readdirSync('.').length) {
      console.log();
      console.log(
        chalk.red.bold(`It seems the current directory isn't empty.`),
      );
      console.log();
      process.exit(0);
    }
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
    process.exit(0);
  }

  projectPathRelative = isCurrentDir ? '.' : appName;

  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: 'Please select your template of choice',
      choices: ['basic', 'pwa', 'GraphQL', 'Nuxt.js'],
    },
  ]);

  // Create a directory in the current path with the given name
  if (!isCurrentDir) {
    fs.mkdirSync(appName);
  }

  projectConfig['name'] = appName;
  projectConfig['template'] = template;

  fetchTemplate(template);
};

module.exports = initializeProject;
