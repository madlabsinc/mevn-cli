'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');

const { dependencyNotInstalled } = require('./messages');
const { executeCommands } = require('../commands/deploy/herokuDeploy');

// Determining host OS
let isLinux = process.platform === 'linux';
let isWin = process.platform === 'win32';
let isMac = process.platform === 'darwin';

exports.validateInstallation = async (dependency) => {
  if (!shell.which(dependency)) {
    await inquirer.prompt([{
      type: 'confirm',
      name: 'installDependency',
      message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`
    }])
    .then((choice) => {
      if (choice.installDependency) {
        if (dependency === 'git') {
          installGit();
        } else {
            installDocker();
          }
      } else {
          dependencyNotInstalled(dependency);
        }
    });
  }
};

const installGit = async () => {
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

const installDocker = async () => {
      if (isMac) {
        try{
          await shell.echo('You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
      } else if (isWin) {
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
