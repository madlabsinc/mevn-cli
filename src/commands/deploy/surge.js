'use strict';

import execa from 'execa';

import Spinner from '../../utils/spinner';

/**
 * Execute shell commands
 * @param {String} cmd - Command to be executed
 * @param {Spinner} spinner - Spinner instance
 * @param {String} successMsg - Suitable message to show up with the spinner on successful completion
 *
 * @returns {Promise<void>}
 */

const exec = async (cmd, spinner, successMsg) => {
  try {
    await execa.command(cmd, { shell: true });
    spinner.succeed(successMsg);
  } catch (err) {
    spinner.fail('Something went wrong');
    throw err;
  }
};

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

const deployToSurge = async () => {
  console.log();

  const installSpinner = new Spinner(`We're getting things ready for you`);
  installSpinner.start();

  // Install surge globally
  await exec(
    'npm install -g surge',
    installSpinner,
    'Successfully installed surge',
  );

  // New spinner instance
  const spinner = new Spinner('Creating a production level build');
  spinner.start();

  // Navigate to the client directory and create the production build
  process.chdir('client');

  // Create a production build with npm run build
  await exec('npm run build', spinner, 'Done');

  // Navigate to the dist directory
  process.chdir('dist');

  // Fire up the surge CLI
  await execa('surge', { stdio: 'inherit' });
};

module.exports = deployToSurge;
