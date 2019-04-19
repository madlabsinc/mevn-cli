'use strict';

const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');
const inquirer = require('inquirer');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

const installDocker = () => {
  shell.echo('Installing Docker');
  inquirer.prompt([{
    name:'answer',
    type:'confirm'
  }])
  .then( async (answers) => {
    if (answers.answer) {
      if (process.platform === 'darwin') { 
        try{
          await shell.echo('Installing Docker for Mac..');
          await shell.echo('You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
      }
      else if (process.platform === 'win32') {
        try{
          await shell.echo('Installing Docker for Windows..');
          await shell.echo('You need to install docker from the official downloads page: https://hub.docker.com/editions/community/docker-ce-desktop-windows');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
        }
      else if (process.platform === 'linux') {
        try{
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
    }
    else {
      shell.echo('Docker was not installed on your system');
    }  
  })
}

exports.dockerize = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    if (!shell.which('docker')) {
      shell.echo('Docker is currently not installed on your system');
      installDocker();
    } else {
    // currently works on linux only
    if (os.type() === 'Linux') {
        console.log('\n');
        shell.exec('sudo docker-compose up', error1(err));
      }
    }

  }, 100);

   function error1(err)
   {
    if (err) {
      console.log(chalk.red.bold('something went wrong!'));
      process.exit(1);
    } else {
      console.log('You are all set...!\nserver:- localhost:9000\nclient:- localhost:8080');
    }
  }

};