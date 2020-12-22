'use strict';

import execa from 'execa';
import fs from 'fs';
import path from 'path';

import exec from '../../utils/exec';
import { fetchProjectConfig } from '../../utils/helpers';
import { validateInstallation } from '../../utils/validate';

/**
 * Deploys the respective SPA to surge.sh platform
 * @returns {Promise<void>}
 */

export default async () => {
  await validateInstallation('surge --help');
  console.log();

  const projectConfig = fetchProjectConfig();
  const { template, isConfigured } = projectConfig;
  const cmd = template === 'Nuxt.js' ? 'generate' : 'build';

  if (!isConfigured.client) {
    await exec(
      `npm install`,
      'Installing dependencies',
      'Dependencies were successfully installed',
      {
        cwd: 'client',
      },
    );

    // Update .mevnrc
    projectConfig.isConfigured.client = true;
    fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));
  }

  // Create a production build with npm run build
  await exec(`npm run ${cmd}`, 'Creating a production level build', 'Done', {
    cwd: 'client',
  });

  // Fire up the surge CLI
  await execa('surge', { cwd: path.join('client', 'dist'), stdio: 'inherit' });
};
