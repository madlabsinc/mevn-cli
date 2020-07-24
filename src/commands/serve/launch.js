'use strict';

import execa from 'execa';
import fs from 'fs';

import exec from '../../utils/exec';

/**
 * Adds PWA support to Nuxt.js boilerplate template
 *
 * @returns {Promise<void>}
 */

const configurePwaSupport = async () => {
  let configFile = JSON.parse(fs.readFileSync('./.mevnrc'));

  if (configFile['isPwa'] && !configFile['isPwaConfigured']) {
    // Install the @nuxtjs/pwa package.
    await exec(
      'npm install --save @nuxtjs/pwa',
      'Installing Nuxt.js pwa module',
      'Done',
      { cwd: 'client' },
    );

    const nuxtConfigFile = fs
      .readFileSync('client/nuxt.config.js')
      .toString()
      .split('\n');

    // Get the index where module definition starts
    let moduleDefStartsWithIndex = nuxtConfigFile.indexOf(
      nuxtConfigFile.find((line) => line.includes('modules: [')),
    );

    nuxtConfigFile[moduleDefStartsWithIndex] = `  modules: [`;

    const contentToAppend = [
      `  '@nuxtjs/eslint-module',`,
      `  '@nuxtjs/pwa'`,
      '  ],',
    ];

    // Make use of the updated value
    moduleDefStartsWithIndex++;

    //  Update modules array to include pwa module
    contentToAppend.forEach((config, idx) =>
      nuxtConfigFile.splice(moduleDefStartsWithIndex + idx, 0, config),
    );

    // Write back the updated config
    fs.writeFileSync('client/nuxt.config.js', nuxtConfigFile.join('\n'));

    // set isPwaConfigured key in the config file to true
    configFile.isPwaConfigured = true;

    fs.writeFileSync(`./.mevnrc`, JSON.stringify(configFile, null, 2));
  }
};

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

  if (projectTemplate === 'Nuxt.js') {
    await configurePwaSupport();
  }
  execa.shell(`npm run serve -- --port ${port} --open`, {
    stdio: 'inherit',
    cwd: templateDir,
  });
};

module.exports = serveProject;
