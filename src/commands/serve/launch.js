'use strict';

import execa from 'execa';
import fs from 'fs';

import exec from '../../utils/exec';

/**
 * Serve the webapp locally
 *
 * @param {String} projectConfig - Boilerplate template of choice
 * @param {String} templateDir - The directory to execute shell command (client/server)
 * @returns {Promise<void>}
 */

export default async (projectConfig, templateDir) => {
  let port;
  const { template: projectTemplate, isConfigured } = projectConfig;

  if (templateDir === 'client') {
    port = projectTemplate === 'Nuxt.js' ? '3000' : '3002';
  } else {
    port = projectTemplate === 'GraphQL' ? '9000/graphql' : '9000/api';
  }

  if (!isConfigured[templateDir]) {
    await exec(
      'npm install',
      'Installing dependencies in the background. Hold on...',
      'Dependencies were successfully installed',
      {
        cwd: templateDir,
      },
    );

    // Update .mevnrc
    projectConfig.isConfigured[templateDir] = true;
    fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));
  }

  const cmd = projectTemplate === 'Nuxt.js' ? 'dev' : 'serve';
  execa.command(`npm run ${cmd} -- --port ${port} --open`, {
    stdio: 'inherit',
    cwd: templateDir,
  });
};
