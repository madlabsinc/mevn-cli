'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import prompts from 'prompts';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
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
  fetchSpinner.succeed(`Successfully installed ${pluginsToInstall.join(', ')}`);
};

/**
 * Choose additional plugins to install on the go
 *
 * @returns {Promise<void>}
 */

const addPlugins = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  const { template } = await appData();

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

  const { pluginChoices } = await prompts({
    type: 'multiselect',
    name: 'pluginChoices',
    message: 'Select the plugins to install',
    choices: installablePlugins,
    default: [
      installablePlugins[Math.floor(Math.random() * installablePlugins.length)],
    ],
  });
  // The index of choice in the array will be used as its value if not specified.
  const plugins = Array.from(pluginChoices, item => installablePlugins[item]);

  // Vuetify bindings for Nuxt-js
  if (template === 'Nuxt-js') plugins.push('@nuxtjs/vuetify@next');

  // Install the opted plugins
  await installPlugins(plugins);

  if (template === 'Nuxt-js') {
    // vuex-store template content for Nuxt-js
    const vuexNuxtStoreTemplate = [
      'export const state = () => ({',
      '  counter: 0',
      '})',
      '',
      'export const mutations = {',
      '  increment (state) {',
      '\tstate.counter++',
      '  }',
      '}',
    ];

    // Vuetify-Config to be inserted
    const vuetifyConfig = [
      '  /*',
      '   ** Set up vuetify',
      '   */',
      '  devModules: [',
      '   @nuxtjs/vuetify',
      '  ],',
      '',
      '  // Vuetify options',
      '  vuetify: {',
      '   //  theme: { }',
      '  }',
    ];

    // Configure vuex-store for Nuxt-js template
    if (plugins.indexOf('vuex') !== -1) {
      // Navigate to the store directory and create a basic store template file
      process.chdir('store');
      fs.writeFileSync('index.js', vuexNuxtStoreTemplate.join('\n'));

      // Hop back to the root directory
      process.chdir('..');
    }

    // Configure @nuxtjs/vuetify
    if (plugins.indexOf('vuetify') !== -1) {
      // Read initial content from nuxt.config.js
      let nuxtConfig = fs
        .readFileSync('./nuxt.config.js', 'utf8')
        .toString()
        .split('\n');

      // Find the position of link within header information
      const indexOfLink = nuxtConfig.indexOf(
        nuxtConfig.find(line => line.includes('link')),
      );

      // Insert the respective content
      vuetifyConfig.forEach((item, i) =>
        nuxtConfig.splice(indexOfLink + i + 2, 0, item),
      );

      // Write back the updated content
      fs.writeFileSync('nuxt.config.js', nuxtConfig.join('\n'));
    }
  } else {
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
      if (plugins.indexOf('vuetify') === -1)
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
  }
};

module.exports = addPlugins;
