'use strict';

import execa from 'execa';

import exec from '../../utils/exec';

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

const deployToSurge = async () => {
  console.log();

  // Install surge globally
  await exec(
    'npm install -g surge',
    `We're getting things ready for you`,
    'Successfully installed surge',
  );

  // Create a production build with npm run build
  await exec('npm run build', 'Creating a production level build', 'Done', {
    cwd: 'client',
  });

  // Fire up the surge CLI
  await execa('surge', { cwd: 'client/dist', stdio: 'inherit' });
};

module.exports = deployToSurge;
