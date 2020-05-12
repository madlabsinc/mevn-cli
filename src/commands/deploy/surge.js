'use strict';

import execa from 'execa';

import exec from '../../utils/exec';
import { validateInstallation } from '../../utils/validate';

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

const deployToSurge = async () => {
  await validateInstallation('surge --help');
  console.log();

  // Create a production build with npm run build
  await exec('npm run build', 'Creating a production level build', 'Done', {
    cwd: 'client',
  });

  // Fire up the surge CLI
  await execa('surge', { cwd: 'client/dist', stdio: 'inherit' });
};

module.exports = deployToSurge;
