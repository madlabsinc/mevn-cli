'use strict';

import execa from 'execa';

import exec from '../../utils/exec';
import Spinner from '../../utils/spinner';

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

const deployToSurge = async () => {
  console.log();

  const spinner = new Spinner(`We're getting things ready for you`);
  spinner.start();

  // Install surge globally
  await exec('npm install -g surge', spinner, 'Successfully installed surge');

  // New spinner instance
  spinner.text = 'Creating a production level build';
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
