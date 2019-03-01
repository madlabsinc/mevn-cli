'use strict';

const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(shell.exec);

const { showBanner } = require('../external/banner');
const { configFileExists } = require('../utils/messages');

exports.dockerize = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();
    
    //check if docker is installed on your system and proceed with the installation depending on the os
    if (!shell.which('docker')) {
      shell.echo('Sorry, docker is not installed on your system, Do you want to install docker?');
      inquirer.prompt([{
        name: 'answer',
        type: 'confirm'
      }]).then((answers) => {
        if (answers.answer) {
          // install docker for linux
          if (process.platform === 'linux') {
            shell.echo('Updating apt and Fetching pre-requisites');
            exec('sudo apt-get update')
            .then(
              () => exec('sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ gnupg-agent \ software-properties-common')
                    .then(
                      () => exec('curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -')
                            .then(
                              () => exec('sudo add-apt-repository \ "deb [arch=amd64] https://download.docker.com/linux/ubuntu \ $(lsb_release -cs) \ stable"')
                                    .then(
                                      () => exec('sudo apt-get update')
                                            .then(
                                              () => exec('sudo apt-get install docker-ce docker-ce-cli containerd.io')
                                                    .then(
                                                      () => shell.echo('Docker was successfully installed on your system')
                                                          )
                                                  )
                                                  .catch((err) => {
                                                    throw err;
                                                  })
                                          )
                                          .catch((err) => {
                                            throw err;
                                          })
                                  )
                                  .catch((err) => {
                                    throw err;
                                  })
                          )
                          .catch((err) => {
                            throw err;
                          }) 
            )
            .catch((err) => {
              throw err;
            });
          }
          // install docker for Mac
          else if (process.platform === 'darwin') {
            shell.echo('You need to install docker from the official downloads page: https://docs.docker.com/docker-for-mac/install/');
          }
          //install git for Windows
          else if (process.platform === 'win32') {
            shell.echo('You need to install docker from the official downloads page: https://hub.docker.com/editions/community/docker-ce-desktop-windows');
            shell.exit(1);
          }
        }
        else{
          shell.echo('Docker was not installed on your system, so we could not deploy your application');
        }
      });
    }
    else{ 
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
