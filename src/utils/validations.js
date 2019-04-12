'use strict';

import inquirer from 'inquirer';
import shell from 'shelljs';

import { dependencyNotInstalled } from './messages';

// Determining host OS
let isLinux = process.platform === 'linux';
let isWin = process.platform === 'win32';
let isMac = process.platform === 'darwin';

exports.validateInstallation = async dependency => {
  return new Promise(resolve => {
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
            if (dependency === 'git') {
              await installGit();
            } else {
              installDocker();
            }
          } else {
            dependencyNotInstalled(dependency);
          }
        });
    } else {
      resolve({ state: 'fulfilled', result: true });
    }
  });
};

const installGit = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // install git for linux
      if (isLinux) {
        //try to install git on the first attempt
        shell.exec('sudo apt-get install git', err => {
          if (err) {
            //throw err;
            //if something went wrong
            //try to update the package and install git again
            shell.exec('sudo apt-get update', err => {
              if (err) {
                throw err;
              } else {
                shell.exec('sudo apt-get install git', err => {
                  if (err) {
                    throw err;
                  } else {
                    shell.echo('Git was installed successfully');
                    resolve({ state: 'fulfilled', result: true });
                  }
                });
              }
            });
          } else {
            shell.echo('Git was installed successfully');
            resolve({ state: 'fulfilled', result: true });
          }
        });
      } else if (isMac) {
        shell.exec('brew install git', err => {
          if (err) {
            shell.echo(
              'There was some error encountered, please download git for Mac from the web!',
            );
            throw err;
          } else {
            shell.echo('Git was installed successfully');
            shell.exit(1);
            resolve({ state: 'fulfilled', result: true });
          }
        });
      }
    }, 100);
  });
};

const installDocker = async () => {
  return new Promise(resolve => {
    if (isMac) {
      try {
        shell.echo(
          'You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/',
        );
        shell.exit(1);
        resolve({ state: 'fulfilled', result: true });
      } catch (err) {
        throw err;
      }
    } else if (isWin) {
      try {
        shell.echo(
          'You need to install docker from the official downloads page: https://hub.docker.com/editions/community/docker-ce-desktop-windows',
        );
        shell.exit(1);
        resolve({ state: 'fulfilled', result: true });
      } catch (err) {
        throw err;
      }
    } else if (isLinux) {
      try {
        shell.echo('Installing Docker for Linux..');
        shell.exec('sudo apt-get update', { silent: true });
        shell.exec(
          'sudo apt-get install  apt-transport-https  ca-certificates  curl  gnupg-agent  software-properties-common',
          { silent: true },
        );
        shell.exec(
          'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -',
          { silent: true },
        );
        shell.exec(
          'sudo add-apt-repository  "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"',
          { silent: true },
        );
        shell.exec('sudo apt-get update', { silent: true });
        shell.exec(
          'sudo apt-get install docker-ce docker-ce-cli containerd.io',
          { silent: true },
        );
        shell.echo('Docker was successfully installed on your system', {
          silent: true,
        });
        resolve({ state: 'fulfilled', result: true });
      } catch (err) {
        throw err;
      }
    }
  });
};
