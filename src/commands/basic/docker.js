'use strict';

import chalk from 'chalk';
import execa from 'execa';
import os from 'os';

import { configFileExists } from '../../utils/messages';
import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';
import Spinner from '../../utils/spinner';
import { validateInstallation } from '../../utils/validations';

exports.dockerize = async () => {
  showBanner();

  await deferExec(100);
  configFileExists();
  await validateInstallation('docker');

  // Currently supports only the linux platform
  if (os.type() === 'Linux') {
    try {
      await require('child_process').exec('sudo -s');
    } catch (err) {
      throw err;
    }

    const spinner = new Spinner(
      'Sit back and relax while we set things up for you',
    );
    spinner.start();
    try {
      await execa('sudo', ['docker-compose', 'up']);
    } catch (err) {
      spinner.fail('Something went wrong');
      throw err;
    }

    spinner.succeed('You are all set');
    console.log(
      chalk.green.bold(
        '\n Services:\n server:- localhost:9000\n client:- localhost:8080',
      ),
    );
  }
};
