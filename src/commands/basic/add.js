'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import showBanner from 'node-banner';

import {
  checkIfConfigFileExists,
  checkIfTemplateIsNuxt,
} from '../../utils/messages';
import Spinner from '../../utils/spinner';

let vuexStoreTemplate = fs.readFileSync(
  path.resolve(__dirname, '..', '..', 'templates/vuex/store.js'),
  'utf8',
);

/**
 * Adds the respective plugin
 *
 * @param {String} pluginToInstall
 * @returns {Promise<void>}
 */

const installPlugins = async pluginsToInstall => {
  const fetchSpinner = new Spinner(`Installing ${pluginsToInstall.join(' ')} `);
  fetchSpinner.start();

  try {
    await execa('npm', ['install', '--save', ...pluginsToInstall]);
  } catch (err) {
    fetchSpinner.fail(`Installation failed`);
    throw err;
  }
  fetchSpinner.succeed(`Successfully installed ${pluginsToInstall.join(' ')}`);
};

/**
 * Choose additional plugins to install on the go
 *
 * @returns {Promise<void>}
 */

const addPlugins = async () => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Exit for the case of Nuxt-js boilerplate template
  await checkIfTemplateIsNuxt();

  // Available plugins to be installed
  const availablePlugins = ['vee-validate', 'axios', 'vuex', 'vuetify'];

  // Hop in to the client directory and fetch the dependencies from package.json
  process.chdir('client');
  const { dependencies } = JSON.parse(
    fs.readFileSync('./package.json', 'utf8').toString(),
  );

  // Show up only those plugins that aren't installed already
  const installablePlugins = availablePlugins.filter(
    plugin => !dependencies.hasOwnProperty(plugin),
  );

  // Warn the user if all available plugins are installed already
  if (!installablePlugins.length) {
    console.log();
    console.log(
      chalk.red.bold(` ${availablePlugins.join(', ')} are already installed`),
    );
    return;
  }

  const { plugins } = await inquirer.prompt({
    type: 'checkbox',
    name: 'plugins',
    message: 'Select the plugins to install',
    choices: installablePlugins,
    default: [
      installablePlugins[Math.floor(Math.random() * installablePlugins.length)],
    ],
  });

  await installPlugins(plugins);

  // Navigate to the src directory and read the content within main.js
  process.chdir('src');

  // Configure vuex-store
  if (plugins.indexOf('vuex') !== -1) {
    let config = fs
      .readFileSync('main.js', 'utf8')
      .toString()
      .split('\n');

    // Creates a new store.js file within the client/src directory.
    fs.writeFileSync('store.js', vuexStoreTemplate);

    // Fetch the index corresponding to the very first blank line
    const blankLineIndex = config.indexOf(config.find(line => line === ''));

    // Inserting the import statement for vuex-store
    config.splice(blankLineIndex, 0, `import store from "./store";`);

    // Fetching the position where in which router is passed on to the Vue instance
    const routerIndex = config.indexOf(
      config.find(line => line.trim() === 'router,'),
    );

    // Insert store just after router so that it gets passed on to the Vue instance
    config.splice(routerIndex + 1, 0, `  store,`);

    // Cleaning up
    config.splice(blankLineIndex + 1, 1);

    // Write back the updated config
    fs.writeFileSync('main.js', config.join('\n'));
  }

  // Configure vuetify
  if (plugins.indexOf('vuetify') !== -1) {
    let config = fs
      .readFileSync('main.js', 'utf8')
      .toString()
      .split('\n');

    // Import Vuetify and minified css towards the top of the config file
    [
      `import Vuetify from 'vuetify';`,
      `import 'vuetify/dist/vuetify.min.css';`,
    ].forEach((item, i) => config.splice(i + 1, 0, item));

    // Fetch the index after which the respective config should come up
    const preIndex = config.indexOf(
      config.find(line => line.includes('Vue.config.productionTip')),
    );

    // Inserting the respective Vuetify config
    ['Vue.use(Vuetify);', ''].forEach((item, i) =>
      config.splice(preIndex + i, 0, item),
    );

    // Write back the updated config
    fs.writeFileSync('main.js', config.join('\n'));
  }
};

module.exports = addPlugins;
