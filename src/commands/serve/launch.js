'use strict';

import execa from 'execa';
import fs from 'fs';

import exec from '../../utils/exec';

/**
 * Serve the webapp locally
 *
 * @param {String} projectTemplate - Boilerplate template of choice
 * @param {String} templateDir - Choose between client/server side
 * @returns {Promise<void>}
 */

const serveProject = async (projectTemplate, templateDir) => {
  let port;

  if (templateDir === 'client') {
    port = projectTemplate === 'Nuxt.js' ? '3000' : '3002';
  } else {
    port = projectTemplate === 'GraphQL' ? '9000/graphql' : '9000/api';
  }

  if (!fs.existsSync(`./${templateDir}/node_modules`)) {
    await exec(
      'npm install',
      'Installing dependencies in the background. Hold on...',
      'Dependencies were successfully installed',
      {
        cwd: templateDir,
      },
    );
  }

  let cmd = 'serve';
  if (projectTemplate === 'Nuxt.js') {
    cmd = 'dev';
    // await configurePwaSupport();
  }
  execa.shell(`npm run ${cmd} -- --port ${port} --open`, {
    stdio: 'inherit',
    cwd: templateDir,
  });
};

module.exports = serveProject;
