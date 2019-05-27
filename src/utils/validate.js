'use strict';

import execa from 'execa';
import inquirer from 'inquirer';
import shell from 'shelljs';

import { dependencyNotInstalled, showInstallationInfo } from './messages';
import { isWin, isLinux } from './constants';
import Spinner from './spinner';

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

exports.validateInput = componentName => {
  if (!componentName) {
    console.log(`Can't be empty!`);
    return false;
  } else {
    return true;
  }
};

const exec = async cmd => {
  return new Promise(async reject => {
    try {
      await execa('apt get update', { stdio: 'inherit' });
      await execa(cmd), { stdio: 'inherit' };
    } catch (err) {
      spinner.fail('Something went wrong');
      reject(err);
    }
    spinner.succeed(`You're good to go`);
  });
};

const installGit = async () => {
  const url = 'https://git-scm.com/download/win';
  if (isWin) {
    showInstallationInfo('git', spinner, url);
  } else {
    const packageMgr = isLinux ? 'apt' : 'brew';
    await exec(`${packageMgr} install git`);
  }
};

const installDocker = async () => {
  const urlMap = {
    win32:
      'https://hub.docker.com/editions/community/docker-ce-desktop-windows',
    darwin: 'https://docs.docker.com/docker-for-mac/install/',
  };

  if (isLinux) {
    await exec('apt install docker.io');
  } else {
    showInstallationInfo('docker', spinner, urlMap[process.platform]);
  }
};

const installHerokuCLI = async () => {
  const url = 'https://devcenter.heroku.com/articles/heroku-cli';
  if (isWin) {
    showInstallationInfo('heroku-cli', spinner, url);
  } else {
    const cmd = isLinux
      ? 'snap install --classic heroku'
      : ['brew tap heroku/brew', 'brew install heroku'];

    if (!Array.isArray(cmd)) {
      await exec(cmd);
    } else {
      await exec(cmd[1]);
      await exec(cmd[2]);
    }
  }
};
