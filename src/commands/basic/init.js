'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import validate from 'validate-npm-package-name';

import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';
import Spinner from '../../utils/spinner';
import { validateInstallation } from '../../utils/validations';

let availableCommands = new Table();

let projectName;
let projectConfig;

const boilerplate = {
  basic: 'https://github.com/MadlabsInc/mevn-boilerplate.git',
  pwa: 'https://github.com/MadlabsInc/mevn-pwa-boilerplate.git',
  graphql: 'https://github.com/MadlabsInc/mevn-graphql-boilerplate.git',
  nuxt: 'https://github.com/MadlabsInc/mevn-nuxt-boilerplate.git',
};

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

    const fetchSpinner = new Spinner('Fetching the boilerplate');
    fetchSpinner.start();
    try {
      await execa(`git`, ['clone', boilerplate[template], projectName]);
    } catch (err) {
      fetchSpinner.fail('Something went wrong');
      throw err;
    }

    // await deferExec(5000);
    console.log('\n');
    fetchSpinner.stop();
    showTables();

    fs.writeFileSync(
      `./${projectName}/mevn.json`,
      projectConfig.join('\n').toString(),
    );

    if (template === 'nuxt') {
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
    }
  } catch (error) {
    throw error;
  }
};

exports.initializeProject = async appName => {
  showBanner();
  console.log('\n');

  await deferExec(100);
  const initialSpinner = new Spinner('Initializing');
  initialSpinner.start();

  await deferExec(1000);
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

  initialSpinner.stop();
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
};
