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

const configureLinter = async (linter, template) => {
  if (linter === 'none') {
    console.log('\n');
  } else {
    if (template === 'nuxt') {
      await installLinter('server', linter, template);
    } else {
      await installLinter('client', linter, template);
      await installLinter('server', linter, template);
    }
  }
};

const installLinter = async (templateDir, linter, template) => {
  console.log(
    `Installing  ${linter} for ${template} template : ${templateDir}`,
  );
  await process.chdir(`${projectName}/${templateDir}`);
  await execa('npm', ['install', '--save', linter]);
  await execa.shell('touch .' + linter + 'ignore');
  await execa.shell('touch .' + linter + 'rc.js');
  await process.chdir('../..');
};

const configurePrettier = async (linter, template) => {
  if (linter === 'none') {
    console('\n');
  } else if (linter === 'eslint') {
    if (template === 'nuxt') {
      await installLinter('server', 'prettier-eslint', template);
    } else {
      await installLinter('client', 'prettier-eslint', template);
      await installLinter('server', 'prettier-eslint', template);
    }
  } else {
    if (template === 'nuxt') {
      await installLinter('server', 'prettier', template);
    } else {
      await installLinter('client', 'prettier', template);
      await installLinter('server', 'prettier', template);
    }
  }
};

const makeInitialCommit = async () => {
  process.chdir(projectName);
  await execa('git', ['init']);
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', 'Initial commit', '-m', 'From Mevn-CLI']);
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

    //Prompt for additional linter fearures
    await inquirer
      .prompt([
        {
          name: 'features',
          type: 'list',
          message: 'Please select your favourite linter',
          choices: ['eslint', 'jslint', 'jshint', 'none'],
        },
      ])
      .then(async option => {
        try {
          await configureLinter(option.features, template);
          //Prompt for Prettier feature
          const { requirePrettier } = await inquirer.prompt([
            {
              name: 'requirePrettier',
              type: 'confirm',
              message: 'Do you require Prettier',
            },
          ]);

          if (requirePrettier) {
            await configurePrettier(option.features, template);
          }
        } catch (err) {
          throw err;
        }
      });

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
