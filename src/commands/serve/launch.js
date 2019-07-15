'use strict';

import execa from 'execa';
import fs from 'fs';
import open from 'open';

import Spinner from '../../utils/spinner';

/**
 * Adds PWA support to Nuxt-js boilerplate template
 *
 * @param {String} templateDir - Choose between client/server side
 * @returns {Promise<void>}
 */

const configurePwaSupport = async () => {
  // Hop to the project root directory
  process.chdir('../');

  let configFile = JSON.parse(fs.readFileSync('./mevn.json').toString());

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

    const index = nuxtConfigFile.indexOf(
      nuxtConfigFile.find(line => line.includes('modules: [')),
    );

    nuxtConfigFile[index] = ` modules: ['@nuxtjs/pwa',`;
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
  const installDepsSpinner = new Spinner(
    'Installing dependencies in the background. Hold on...',
  );
  installDepsSpinner.start();

  const rootPath = 'http://localhost';
  let port;

  if (templateDir === 'client') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }
  try {
    await execa('npm', ['install']);
    if (projectTemplate === 'Nuxt-js') await configurePwaSupport();
  } catch (err) {
    installDepsSpinner.fail(
      `Something went wrong. Couldn't install the dependencies!`,
    );
    throw err;
  }
  installDepsSpinner.succeed(`You're all set`);

  // Navigate back to the respective directory
  if (projectTemplate === 'Nuxt-js') process.chdir(templateDir);

  const launchSpinner = new Spinner(
    'The default browser will open up in a while',
  );

  launchSpinner.start();
  Promise.all([execa.shell('npm run serve'), open(`${rootPath}:${port}`)]);
  launchSpinner.info(`Available on ${rootPath}:${port}`);
};

module.exports = serveProject;
