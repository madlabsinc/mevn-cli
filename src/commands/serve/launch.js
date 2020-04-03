'use strict';

import execa from 'execa';
import fs from 'fs';

import Spinner from '../../utils/spinner';

/**
 * Adds PWA support to Nuxt-js boilerplate template
 *
 * @returns {Promise<void>}
 */

const configurePwaSupport = async () => {
  // Hop to the project root directory
  process.chdir('../');

  let configFile = JSON.parse(fs.readFileSync('./.mevnrc'));

  if (configFile['isPwa']) {
    // Install the @nuxtjs/pwa package.
    try {
      await execa('npm', ['install', '@nuxtjs/pwa']);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    // Hop in to the client directory
    process.chdir('client');

    const nuxtConfigFile = fs
      .readFileSync('nuxt.config.js')
      .toString()
      .split('\n');

    // Get the index where module definition starts
    let moduleDefStartsWithIndex = nuxtConfigFile.indexOf(
      nuxtConfigFile.find(line => line.includes('modules: [')),
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
    fs.writeFileSync('nuxt.config.js', nuxtConfigFile.join('\n'));

    // Hop back to the root directory
    process.chdir('../');
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
  const rootPath = 'http://localhost';
  let port;

  if (templateDir === 'client') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '3002';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }

  if (!fs.existsSync('./node_modules')) {
    const installDepsSpinner = new Spinner(
      'Installing dependencies in the background. Hold on...',
    );
    installDepsSpinner.start();
    try {
      await execa('npm', ['install']);
    } catch (err) {
      installDepsSpinner.fail(
        `Something went wrong. Couldn't install the dependencies!`,
      );
      throw err;
    }
    installDepsSpinner.succeed('Dependencies were successfully installed');
  }

  if (projectTemplate === 'Nuxt-js') {
    await configurePwaSupport();
  }

  // Navigate back to the respective directory
  if (projectTemplate === 'Nuxt-js') {
    process.chdir(templateDir);
  }

  const launchSpinner = new Spinner(
    templateDir === 'client'
      ? 'The default browser will open up in a while'
      : 'Finalizing',
  );

  launchSpinner.start();
  try {
    execa.shell(`npm run serve -- --port ${port} --open`);
  } catch ({ stderr }) {
    throw stderr;
  }
  launchSpinner.info(`Available on ${rootPath}:${port}`);
};

module.exports = serveProject;
