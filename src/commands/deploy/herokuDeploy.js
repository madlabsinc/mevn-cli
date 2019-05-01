'use strict';

import { spawn } from 'child_process';
import inquirer from 'inquirer';
import shell from 'shelljs';

// import { appData } from '../../utils/projectConfig';
import { configFileExists, dependencyNotInstalled } from '../../utils/messages';
import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';

// Determining host OS
let isLinux = process.platform === 'linux';
let isWin = process.platform === 'win32';
let isMac = process.platform === 'darwin';

const validateInstallation = async () => {
  if (!shell.which('heroku')) {
    await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'installDependency',
          message: `Sorry, heroku-cli is not installed on your system, Do you want to install it?`,
        },
      ])
      .then(choice => {
        if (choice.installDependency) {
          installHerokuCLI();
        } else {
          dependencyNotInstalled('heroku-cli');
        }
      });
  }
};

const exec = cmd => {
  return new Promise((resolve, reject) => {
    try {
      spawn(cmd.split(' ')[0], cmd.split(' ').slice(1), { stdio: 'inherit' });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const deployWithGit = async () => {
  const commands = ['heroku login', 'heroku create', 'git push heroku master'];

  await exec(commands[0]);
};

const deployWithDocker = async () => {
  const commands = [
    'heroku login',
    'heroku container:login',
    'heroku create',
    'heroku container:push web',
    'heroku container:release web',
    'heroku open',
  ];

  await exec(commands[0]);
};

exports.deploy = async () => {
  showBanner();

  await deferExec(100);
  configFileExists();
  await validateInstallation('heroku');

  inquirer
    .prompt([
      {
        name: 'mode',
        type: 'list',
        choices: ['Deploy with Git', 'Deploy with Docker'],
        message: 'Choose your preferred mode',
      },
    ])
    .then(choice => {
      choice.mode === 'Deploy with Git' ? deployWithGit() : deployWithDocker();
    });
};

const installHerokuCLI = async () => {
  if (isWin) {
    try {
      await shell.echo('Installing heroku for Windows...');
      await shell.echo(
        'You need to manually download heroku-cli from: https://devcenter.heroku.com/articles/heroku-cli and try to deploy again',
      );
      await shell.exit(1);
    } catch (err) {
      throw err;
    }
  } else if (isMac) {
    try {
      await shell.echo('Installing heroku for Mac...');
      await shell.exec('brew tap heroku/brew && brew install heroku', {
        silent: true,
      });
    } catch (err) {
      throw err;
    }
  } else if (isLinux) {
    try {
      await shell.echo('Installing heroku for Linux...');
      await shell.exec('sudo apt get update', { silent: true });
      await shell.exec('sudo apt-get install snap', { silent: true });
      await shell.exec('sudo snap install --classic heroku', { silent: true });
      await shell.echo('Heroku was installed successfully');
    } catch (err) {
      throw err;
    }
  }
};
