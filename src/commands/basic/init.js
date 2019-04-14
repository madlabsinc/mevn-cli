'use strict';

import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import fs from 'fs';
import inquirer from 'inquirer';
import logUpdate from 'log-update';
import shell from 'shelljs';
import Table from 'cli-table3';
import validate from 'validate-npm-package-name';

import boilerplate from '../../config.json';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validations';

let availableCommands = new Table();
let frame = elegantSpinner();

let projectName;
let projectConfig;

let showTables = () => {
  console.log(chalk.yellow('\n Available commands:-'));

  availableCommands.push(
    {
      'mevn version': 'Current CLI version',
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
      'mevn create:component <name>': 'Create new components',
    },
    {
      'mevn codesplit <name>': 'Lazy load components',
    },
    {
      'mevn create:git-repo': 'Create a GitHub Repo',
    },
    {
      'mevn dockerize': 'Launch within docker containers',
    },
    {
      'mevn deploy': 'Deploy the app to Heroku',
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
  console.log(chalk.redBright('\n warning:'));
  console.log(' Do not delete mevn.json file');
};

let fetchTemplate = async template => {
  try {
    await validateInstallation('git');

    shell.exec(
      `${boilerplate[template]} ${projectName}`,
      { silent: true },
      { async: true },
    );

    let fetchSpinner = setInterval(() => {
      logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
    }, 50);

    setTimeout(() => {
      console.log('\n');
      clearInterval(fetchSpinner);
      logUpdate.clear();
      showTables();
    }, 5000);

    fs.writeFileSync(
      `./${projectName}/mevn.json`,
      projectConfig.join('\n').toString(),
    );

    if (template === 'nuxt') {
      setTimeout(() => {
        console.log('\n');

        inquirer
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
            showTables();
          });
      }, 5000);
    }
  } catch (error) {
    throw error;
  }
};

exports.initializeProject = appName => {
  showBanner();
  console.log('\n');

  let initialSpinner = setInterval(() => {
    logUpdate('Initializing ' + chalk.cyan.bold.dim(frame()));
  }, 50);

  setTimeout(() => {
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

    clearInterval(initialSpinner);
    logUpdate.clear();
    projectName = appName;

    inquirer
      .prompt([
        {
          name: 'template',
          type: 'list',
          message: 'Please select one',
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
  }, 1000);
};
