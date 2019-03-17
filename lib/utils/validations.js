'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');

const { dependencyNotInstalled } = require('./messages');
const { executeCommands } = require('../commands/deploy/herokuDeploy');

// Determining host OS
let isLinux = process.platform === 'linux';
let isWindows = process.platform === 'win32';
let isMac = process.platform === 'darwin';

exports.validateInstallation = (dependency) => {
  if (!shell.which(dependency)) {
    inquirer.prompt([{
      type: 'confirm',
      name: 'installDependency',
      message: `Sorry, ${dependency} is not installed on your system, Do you want to install ${dependency}?`
    }])
    .then((choice) => {
      if (choice.installDependency) {
        if (dependency === 'git') {
          validateGitInstallation();
        } else if (dependency === 'docker') {
            validateDockerInstallation();
          } else {
              validateHerokuCLIInstallation();
            }
      } else {
          dependencyNotInstalled(dependency);
        }
    });
  }
};

const validateGitInstallation = async () => {
  // install git for linux
  if(isLinux){
    shell.exec('sudo apt-get update', (err) => {
      if(err){
        throw err;
      } else {
         shell.exec('sudo apt-get install git', (err) => {
          if (err) {
            throw err;
          } else {
             shell.echo('Git was installed successfully');
            }
          });
        }
      });
    } else if (isMac) {
        shell.exec('brew install git', (err) => {
          if (err) {
            shell.echo('There was some error encountered, please download git for Mac from the web!');
            throw err;
          } else {
             shell.echo('Git was installed successfully');
             shell.exit(1);
            }
          });
        }
};

const validateDockerInstallation = async () => {
      if (isMac) {
        try{
          await shell.echo('You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
      } else if (isWindows) {
          try{
            await shell.echo('You need to install docker from the official downloads page: https://hub.docker.com/editions/community/docker-ce-desktop-windows');
            shell.exit(1);
          } catch (err) {
              throw err;
            }
        } else if (isLinux) {
            try {
              await shell.echo('Installing Docker for Linux..');
              await shell.exec('sudo apt-get update', {silent: true});
              await shell.exec('sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ gnupg-agent \ software-properties-common', {silent: true});
              await shell.exec('curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -', {silent: true});
              await shell.exec('sudo add-apt-repository \ "deb [arch=amd64] https://download.docker.com/linux/ubuntu \ $(lsb_release -cs) \ stable"', {silent: true});
              await shell.exec('sudo apt-get update', {silent: true});
              await shell.exec('sudo apt-get install docker-ce docker-ce-cli containerd.io', {silent: true});
              await shell.echo('Docker was successfully installed on your system', {silent: true});
            } catch (err) {
                throw err;
              }
            }
};

const validateHerokuCLIInstallation = async () => {
    if (isWindows) {
      try{
        await shell.echo('Installing heroku for Windows...');
        await hell.echo('You need to manually download heroku-cli from: https://devcenter.heroku.com/articles/heroku-cli and try to deploy again');
        await shell.exit(1);
      }
      catch (err) {
        throw err;
      }
    } else if (isMac) {
        try {
          await shell.echo('Installing heroku for Mac...')
          await shell.exec('brew tap heroku/brew && brew install heroku', {silent: true});
        } catch (err) {
            throw err;
          }
        } else if (isLinux) {
            try {
              await shell.echo('Installing heroku for Linux...');
              await shell.exec('sudo apt get update', {silent: true});
              await shell.exec('sudo apt-get install snap', {silent: true});
              await shell.exec('sudo snap install --classic heroku', {silent: true});
              await shell.echo('Heroku was installed successfully');
           } catch (err) {
              throw err;
            }
          }
};
