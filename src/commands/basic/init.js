'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import validate from 'validate-npm-package-name';
import { showBanner } from '../../external/banner';
import Spinner from '../../utils/spinner';
import { validateInstallation } from '../../utils/validate';

let availableCommands = new Table();

let projectName;
let projectConfig;

const boilerplate = {
  basic: 'https://github.com/madlabsinc/mevn-boilerplate.git',
  pwa: 'https://github.com/madlabsinc/mevn-pwa-boilerplate.git',
  graphql: 'https://github.com/madlabsinc/mevn-graphql-boilerplate.git',
  nuxt: 'https://github.com/madlabsinc/mevn-nuxt-boilerplate.git',
};

const installLintUtility = async (cmd, templateDir) => {
  const utility = cmd
    .split(' ')
    .slice(-1)
    .pop();

  const installSpinner = new Spinner(`Installing ${utility} for client`);
  installSpinner.start();

  // Hop over to the client directory except for the case of Nuxt-js template
  if (templateDir) {
    process.chdir(path.resolve(projectName, 'client'));
  } else {
    process.chdir(path.resolve(projectName));
  }

  try {
    await execa.shell(cmd);
  } catch (err) {
    installSpinner.fail('Something went wrong');
    process.exit(1);
  }

  installSpinner.text = `Installing ${utility} for Server`;

  // Navigate to the server directory
  process.chdir(path.resolve(projectName, 'server'));
  try {
    await execa.shell(cmd);
  } catch (err) {
    installSpinner.fail('Something went wrong');
    process.exit(1);
  }
  installSpinner.succeed(`Succcessfully installed ${utility}`);
};

const configureLintUtility = async (template, linter, requirePrettier) => {
  let templateDir = '';
  if (template !== 'Nuxt-js') templateDir = 'client';

  // Installs the linter of choice.
  if (linter !== 'none')
    await installLintUtility(`npm i -D ${linter}`, templateDir);

  // ToDo: Create and populate .{linter}rc and .{linter}ignore files
  if (requirePrettier) {
    // Install prettier.
    await installLintUtility('npm i -D prettier', templateDir);

    if (linter !== 'eslint') {
      // Configure prettier for jshint and jslint
    } else {
      // Configure eslint-prettier presets.
    }
  }
};

const makeInitialCommit = async () => {
  process.chdir(path.resolve(projectName));
  await execa('git', ['init']);
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', 'Initial commit', '-m', 'From Mevn-CLI']);
};

let showTables = () => {
  console.log(chalk.yellow('\n Available commands:-'));

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

  console.log(
    chalk.cyanBright(
      `\n\n Make sure that you've done ${chalk.greenBright(
        `cd ${projectName}`,
      )}`,
    ),
  );
  console.log(
    `${chalk.yellow.bold('\n Warning: ')} Do not delete the mevn.json file`,
  );

  let removeCmd = process.platform === 'win32' ? 'rmdir /s /q' : 'rm -rf';
  execa.shellSync(`${removeCmd} ${path.join(projectName, '.git')}`);
  makeInitialCommit();
};

const fetchTemplate = async template => {
  try {
    await validateInstallation('git');

    const fetchSpinner = new Spinner('Fetching the boilerplate');
    fetchSpinner.start();
    try {
      await execa(`git`, ['clone', boilerplate[template], projectName]);
    } catch (err) {
      fetchSpinner.fail('Something went wrong');
      throw err;
    }

    fetchSpinner.stop();

    fs.writeFileSync(
      `./${projectName}/mevn.json`,
      projectConfig.join('\n').toString(),
    );

    // Prompts asking for the linter of choice and prettier support.

    const { linterOfChoice } = await inquirer.prompt([
      {
        name: 'linterOfChoice',
        type: 'list',
        message: 'Please select your favourite linter',
        choices: ['eslint', 'jslint', 'jshint', 'none'],
      },
    ]);

    const { requirePrettier } = await inquirer.prompt([
      {
        name: 'requirePrettier',
        type: 'confirm',
        message: 'Do you require Prettier',
      },
    ]);

    await configureLintUtility(template, linterOfChoice, requirePrettier);

    if (template === 'nuxt') {
      const { requirePwaSupport } = await inquirer.prompt([
        {
          name: 'requirePwaSupport',
          type: 'confirm',
          message: 'Do you require pwa support',
        },
      ]);

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

      await inquirer
        .prompt([
          {
            name: 'mode',
            type: 'list',
            message: 'Choose your preferred mode',
            choices: ['Universal', 'SPA'],
          },
        ])
        .then(choice => {
          if (choice.mode === 'Universal') {
            let configFile = fs
              .readFileSync(`./${projectName}/nuxt.config.js`, 'utf8')
              .toString()
              .split('\n');

            let index = configFile.indexOf(
              configFile.find(line => line.includes('mode')),
            );
            configFile[index] = ` mode: 'universal',`;

            fs.writeFileSync(
              `./${projectName}/nuxt.config.js`,
              configFile.join('\n'),
            );
          }
        });
    }
    showTables();
  } catch (error) {
    throw error;
  }
};

exports.initializeProject = async appName => {
  await showBanner();

  const hasMultipleProjectNameArgs =
    process.argv[4] && !process.argv[4].startsWith('-');

  // Validation for multiple directory names
  if (hasMultipleProjectNameArgs) {
    console.log(
      chalk.red.bold(
        '\n Kindly provide only one argument as the directory name!!',
      ),
    );
    process.exit(1);
  }

  const validationResult = validate(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`,
      )} because of npm naming restrictions:`,
    );
    process.exit(1);
  }

  if (fs.existsSync(appName)) {
    console.error(
      chalk.red.bold(`\n Directory ${appName} already exists in path!`),
    );
    process.exit(1);
  }

  projectName = appName;

  inquirer
    .prompt([
      {
        name: 'template',
        type: 'list',
        message: 'Please select your template of choice',
        choices: ['basic', 'pwa', 'graphql', 'Nuxt-js'],
      },
    ])
    .then(choice => {
      projectConfig = [
        '{',
        `"name": "${appName}",`,
        `"template": "${choice.template}"`,
        '}',
      ];

      if (choice.template === 'Nuxt-js') {
        choice.template = 'nuxt';
      }
      fetchTemplate(choice.template);
    });
};
