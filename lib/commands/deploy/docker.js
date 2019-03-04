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
          await shell.echo('You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
      }
      else if (process.platform === 'win32') {
        try{
          await shell.echo('You need to install docker from the official downloads page: https://hub.docker.com/editions/community/docker-ce-desktop-windows');
          shell.exit(1);
        } catch (err) {
          throw err;
        }
        }
      else if (process.platform === 'linux') {
        try{
          await shell.exec('sudo apt-get update');
          await shell.exec('sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ gnupg-agent \ software-properties-common');
          await shell.exec('curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -');
          await shell.exec('sudo add-apt-repository \ "deb [arch=amd64] https://download.docker.com/linux/ubuntu \ $(lsb_release -cs) \ stable"');
          await shell.exec('sudo apt-get update');
          await shell.exec('sudo apt-get install docker-ce docker-ce-cli containerd.io');
          await shell.echo('Docker was successfully installed on your system');
        } catch (err) {
          throw err;
        }
      }
    }
    else {
      shell.echo('Docker was no installed on your system');
    }  
  })
}

exports.dockerize = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    if (!shell.which('docker')) {
      installDocker();
    } else {
    // currently works on linux only
    if (os.type() === 'Linux') {
        console.log('\n');
        shell.exec('sudo docker-compose up', (err) => {
          if (err) {
            console.log(chalk.red.bold('something went wrong!'));
            process.exit(1);
          } else {
            console.log('You are all set...!\nserver:- localhost:9000\nclient:- localhost:8080');
          }
        });
      }
    }

  }, 100);
};