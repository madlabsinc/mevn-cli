'use strict';

import chalk from 'chalk';
import inquirer from 'inquirer';
import os from 'os';
import shell from 'shelljs';

import { configFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validations';

exports.dockerize = () => {
  showBanner();

  setTimeout(async () => {
    configFileExists();
    await validateInstallation('docker');

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

  }, 100);
};
