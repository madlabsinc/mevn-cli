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

let projectName;
let projectConfig;

/**
 * Creates an initial local commit
 *
 * @returns {Void}
 */

const makeInitialCommit = () => {
  // Navigate to the project directory
  process.chdir(projectName);

  // Commands to be executed serially
  const commands = ['init', 'add .', `commit -m "Init" -m "Mevn-CLI"`];

  // Execute commands serially
  commands.forEach(cmd => execa.sync('git', cmd.split(' ')));
};

/**
 * Logs the further actions to be performed
 *
 * @returns {Void}
 */

const showInstructions = () => {
  console.log();
  console.log();
  console.log(chalk.cyan.bold(` You're all set`));
  console.log(
    chalk.cyan.bold(
      ` Now, just type in ${chalk.green.bold(
        `cd ${projectName}`,
      )} && ${chalk.green.bold('mevn serve')}`,
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
 * Fetch the user reqired test runner
 *
 * @param {String} template
 * @returns {Promise<Void>}
 */
const fetchTestRunner = async template => {
  const { testRunner } = await inquirer.prompt([
    {
      name: 'testRunner',
      type: 'list',
      message: 'Please select your test framework for your project',
      choices: ['none', 'ava', 'jest', 'mocha'],
    },
  ]);
  if (testRunner === 'none') {
    return;
  }
  if (testRunner === 'ava' && template === 'nuxt') {
    return;
  }

  process.chdir(`${projectName}/client/`);

  const fetchSpinner = new Spinner(`Installing the ${testRunner}`);
  fetchSpinner.start();
  try {
    await execa('npm', ['install', '--save-dev', testRunner]);
  } catch (err) {
    fetchSpinner.fail('Something went wrong');
    throw err;
  }
  fetchSpinner.stop();

  //Make npm script 'test'
  let packageJsonFile = JSON.parse(
    fs.readFileSync('./package.json').toString(),
  );
  packageJsonFile.scripts['test'] = testRunner;
  fs.writeFileSync('./package.json', JSON.stringify(packageJsonFile, null, 2));

  //Create config file for testrunners
  const testFolderName = template === 'nuxt' ? 'test' : 'tests';

  switch (testRunner) {
    case 'ava': {
      const avaConfig = `export default {
  files: ['${testFolderName}/**/*']
};`;
      fs.writeFileSync('./ava.config.js', avaConfig);
      break;
    }
    case 'jest': {
      const jestConfig = `module.exports = {
  verbose: true,
  testMatch: ["${testFolderName}/**/*.test.js"]
};`;
      fs.writeFileSync('./jest.config.js', jestConfig);
      break;
    }
    case 'mocha': {
      const mochaConfig = `'use strict';

// Here's a JavaScript-based config file.
// If you need conditional logic, you might want to use this type of config.
// Otherwise, JSON or YAML is recommended.

module.exports = {
  diff: true,
  extension: ['js'],
  opts: false,
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-files': ['lib/**/*.js', '${testFolderName}/**/*.js'],
  'watch-ignore': ['lib/vendor']
};`;
      fs.writeFileSync('./.mocharc.js', mochaConfig);
      break;
    }
  }
  process.chdir('../../');
};

/**
 * Fetch the boilerplate template of choice
 *
 * @param {String} template - The branch which corresponds to the respective boilerplate template
 * @returns {Promise<void>}
 */

const fetchTemplate = async templateBranch => {
  await validateInstallation('git help -g');

  // Content to be written into docker-compose.yml at the project root
  const dockerComposeTemplate = [
    `version: '3'`,
    'services:',
    '  vue-client:',
    `${' '.repeat(4)}build: ./client`,
    `${' '.repeat(4)}command: npm run serve`,
    `${' '.repeat(4)}ports:`,
    `${' '.repeat(4)}  - "8080:8080"`,
    '',
    '  node-server:',
    `${' '.repeat(4)}build: ./server`,
    `${' '.repeat(4)}command: npm run serve`,
    `${' '.repeat(4)}ports:`,
    `${' '.repeat(4)}  - "9000:9000"`,
    `${' '.repeat(4)}links:`,
    `${' '.repeat(4)}  - mongo`,
    '',
    '  mongo:',
    `${' '.repeat(4)}image: mongo`,
    `${' '.repeat(4)}ports:`,
    `${' '.repeat(4)}  - "27017:27017" `,
  ];

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

  // Create a docker-compose.yml (config) file at the project root
  fs.writeFileSync(
    `./${projectName}/docker-compose.yml`,
    requireServer
      ? dockerComposeTemplate.join('\n')
      : dockerComposeTemplate.slice(0, 7).join('\n'),
  );

  //Show user prompt for chosing test runner
  await fetchTestRunner(templateBranch);

  // Show up initial instructions to the user
  showInstructions();
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
