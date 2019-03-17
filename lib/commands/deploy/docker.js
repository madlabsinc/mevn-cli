'use strict';

const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');
const inquirer = require('inquirer');

const { configFileExists } = require('../../utils/messages');
const { showBanner } = require('../../external/banner');
const { validateInstallation } = require('../../utils/validations');

exports.dockerize = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    if (!shell.which('docker')) {
      shell.echo('Docker is currently not installed on your system');
      validateInstallation('docker');
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
