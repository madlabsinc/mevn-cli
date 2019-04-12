'use strict';

import inquirer from 'inquirer';
import os from 'os';
import shell from 'shelljs';

import { appData } from '../../utils/projectConfig';
import { configFileExists, dependencyNotInstalled } from '../../utils/messages';
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

exports.deploy = () => {
  showBanner();

  setTimeout(async () => {
    configFileExists();
    await validateInstallation('heroku');

    let templateIsNuxt;
    await appData().then(data => {
      templateIsNuxt = data.template === 'Nuxt-js';
    });

    let serverPath = templateIsNuxt ? `/${process.cwd()}/server` : '../server';
    let moveCmd = os.type() === 'Windows_NT' ? 'move' : 'mv';

    if (!templateIsNuxt) {
      shell.cd('client');
    }

    const buildCommands = [
      'npm install',
      'npm run build',
      `${moveCmd} /${process.cwd()}/dist ${serverPath}`,
      `sudo docker login --username=_ --password=$(heroku auth:token) registry.heroku.com`,
    ];
    await Promise.all(
      buildCommands.map(cmd => {
        shell.exec(cmd, { silent: true });
      }),
    ).catch(err => {
      throw err;
    });
    shell.echo('\n Creating a heroku app');
    await shell.exec('heroku create');

    inquirer
      .prompt([
        {
          name: 'appName',
          type: 'input',
          message: 'Please enter the name of heroku app(url)',
        },
      ])
      .then(async userInput => {
        try {
          await shell.exec(
            `sudo heroku container:push web -a ${userInput.appName}`,
          );
          await shell.exec(
            `sudo heroku container:release web -a ${userInput.appName}`,
          );
          await shell.exec(`heroku open -a ${userInput.appName}`);
        } catch (err) {
          throw err;
        }
      });
  }, 100);
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
