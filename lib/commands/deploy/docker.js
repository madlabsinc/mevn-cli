'use strict';

const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

exports.dockerize = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    // currently works on linux only
    if(os.type() === 'Linux') {

      console.log('\n');
      shell.exec('sudo docker-compose up', (err) => {
        if(err) {
          console.log(chalk.red.bold('something went wrong!'));
          process.exit(1);
        } else {
          console.log('You are all set...!\nserver:- localhost:9000\nclient:- localhost:8080');
        }
      });
    }

  }, 100);
};
