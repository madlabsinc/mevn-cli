'use strict';

import execa from 'execa';
import fs from 'fs';

import exec from '../../utils/exec';

/**
 * Install Nuxt.js modules
 *
 * @param {String[]} deps - Nuxt.js modules
 * @returns {Promise<void>}
 */

const installDeps = async (deps) => {
  await exec(
    `npm install --save ${deps}`,
    'Installing Nuxt.js modules',
    `${deps} is successfully installed and configured`,
    {
      cwd: 'client',
    },
  );
};

/**
 * Serve the webapp locally
 *
 * @param {String} projectConfig - Boilerplate template of choice
 * @param {String} templateDir - The directory to execute shell command (client/server)
 * @returns {Promise<void>}
 */

const serveProject = async (projectConfig, templateDir) => {
  let port;
  const { template: projectTemplate } = projectConfig;

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

  // Install Nuxt.js modules
  if (templateDir === 'client' && projectTemplate === 'Nuxt.js') {
    const { modules, isConfigured } = projectConfig;
    if (!isConfigured) {
      const installCandidate = modules.filter((module) =>
        ['pwa', 'axios', 'content'].includes(module),
      );

      // Do not proceed if the user haven't opted for any Nuxt.js modules
      if (installCandidate.length) {
        // Add the @nuxtjs prefix
        const modulesWithPrefix = installCandidate.map(
          (module) =>
            `${module === 'content' ? `@nuxt/${module}` : '@nuxtjs'}/${module}`, // @nuxt/content has different prefix
        );

        // @nuxtjs/pwa is to be installed as a devDependency
        if (installCandidate.includes('pwa')) {
          await exec(
            'npm install --save-dev @nuxtjs/pwa',
            'Installing Nuxt.js pwa module',
            '@nuxtjs/pwa is successfully installed and configured',
            {
              cwd: templateDir,
            },
          );
          // User opted for additional Nuxt.js modules as well
          if (installCandidate.length > 1) {
            const deps = modulesWithPrefix
              .filter((module) => module !== '@nuxtjs/pwa')
              .join(' ');
            await installDeps(deps);
          }
        } else {
          // User hasn't opted for @nuxtjs/pwa module
          await installDeps(modulesWithPrefix.join(' '));
        }
      }

      // Update the isConfigured key
      projectConfig.isConfigured = true;
      fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));
    }
  }

  let cmd = 'serve';
  if (projectTemplate === 'Nuxt.js') {
    cmd = 'dev';
  }
  execa.shell(`npm run ${cmd} -- --port ${port} --open`, {
    stdio: 'inherit',
    cwd: templateDir,
  });
};

module.exports = serveProject;
