'use strict';

import execa from 'execa';
import fs from 'fs';

import appData from '../../utils/projectConfig';
import exec from '../../utils/exec';
import { validateInstallation } from '../../utils/validate';

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

const deployToSurge = async () => {
  await validateInstallation('surge --help');
  console.log();

  const { template } = appData();
  const cmd = template === 'Nuxt.js' ? 'generate' : 'build';

  if (!fs.existsSync('./client/node_modules')) {
    await exec(
      `npm install`,
      'Installing dependencies',
      'Dependencies are successfully installed',
      {
        cwd: 'client',
      },
    );
  }

  // Create a production build with npm run build
  await exec(`npm run ${cmd}`, 'Creating a production level build', 'Done', {
    cwd: 'client',
  });

  // Fire up the surge CLI
  await execa('surge', { cwd: 'client/dist', stdio: 'inherit' });
};

module.exports = deployToSurge;
