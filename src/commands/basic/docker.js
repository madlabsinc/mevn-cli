'use strict';

import chalk from 'chalk';
import execa from 'execa';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import { isWin } from '../../utils/constants';
import { validateInstallation } from '../../utils/validate';

/**
 * Launch multiple containers with docker-compose (client, server and mongo client)
 *
 * @returns {Promise<void>}
 */

const dockerize = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();
  await validateInstallation('docker');

  try {
    // Requires administrative (super-user) privilege
    // Sets up the environment by pulling required images as in the config file
    const { stdout } = await execa(`${isWin ? '' : 'sudo'} docker-compose up`, {
      stdio: 'inherit',
      shell: true,
    });

    // Log the results to stdout
    console.log(stdout);
  } catch (err) {
    throw err;
  }

  console.log();
  console.log(
    chalk.green.bold(
      ' Services:\n server:- http://localhost:9000\n client:- http://localhost:8080',
    ),
  );
};

module.exports = dockerize;
