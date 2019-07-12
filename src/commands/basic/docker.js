'use strict';

import chalk from 'chalk';
import execa from 'execa';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import Spinner from '../../utils/spinner';
import { isWin } from '../../utils/constants';
import { validateInstallation } from '../../utils/validate';

/**
 * Launch the webapp locally within a Docker container
 *
 * @returns {Promise<void>}
 */

const dockerize = async () => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();
  await validateInstallation('docker');

  const spinner = new Spinner(
    'Sit back and relax while we set things up for you',
  );
  spinner.start();
  try {
    if (isWin) {
      await execa.shell('docker-compose up', { stdio: 'inherit' });
    } else {
      await execa.shell('sudo docker-compose up', { stdio: 'inherit' });
    }
  } catch (err) {
    spinner.fail('Something went wrong');
    throw err;
  }

  spinner.succeed('You are all set');
  console.log();
  console.log(
    chalk.green.bold(
      ' Services:\n server:- http://localhost:9000\n client:- http://localhost:8080',
    ),
  );
};

module.exports = dockerize;
