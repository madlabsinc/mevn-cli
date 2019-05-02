'use strict';

import execa from 'execa';
import inquirer from 'inquirer';
import shell from 'shelljs';

import { dependencyNotInstalled, showInstallationInfo } from './messages';
import Spinner from './spinner';

// Determining host OS
let isLinux = process.platform === 'linux';
let isWin = process.platform === 'win32';

// Initialize the spinner
const spinner = new Spinner();

exports.validateInstallation = async dependency => {
  if (!shell.which(dependency)) {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'installDependency',
          message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
        },
      ])
      .then(async choice => {
        if (choice.installDependency) {
          spinner.text = `Installing ${choice.installDependency}`;
          spinner.start();

          if (dependency === 'git') {
            installGit();
          } else if (dependency === 'docker') {
            installDocker();
          } else {
            installHerokuCLI();
          }
        } else {
          dependencyNotInstalled(dependency);
        }
      });
  }
};

const exec = async cmd => {
  try {
    await execa('apt get update');
    await execa(cmd);
  } catch (err) {
    spinner.fail('Something went wrong');
    throw err;
  }
  spinner.succeed(`You're good to go`);
};

const installGit = async () => {
  const url = 'https://git-scm.com/download/win';
  if (isWin) {
    showInstallationInfo(spinner, url);
  } else {
    const packageMgr = isLinux ? 'apt' : 'git';
    exec(`${packageMgr} install git`);
  }
};

const installDocker = async () => {
  const urlMap = {
    win32:
      'https://hub.docker.com/editions/community/docker-ce-desktop-windows',
    darwin: 'https://docs.docker.com/docker-for-mac/install/',
  };

  if (isLinux) {
    exec('apt install docker.io');
  } else {
    showInstallationInfo(spinner, urlMap[process.platform]);
  }
};

const installHerokuCLI = async () => {
  const url = 'https://devcenter.heroku.com/articles/heroku-cli';
  if (isWin) {
    showInstallationInfo(spinner, url);
  } else {
    const cmd = isLinux
      ? 'snap install --classic heroku'
      : ['brew tap heroku/brew', 'brew install heroku'];

    if (!Array.isArray(cmd)) {
      exec(cmd);
    } else {
      cmd.map(c => exec(c));
    }
  }
};
