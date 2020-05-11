'use strict';

import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import dirOfChoice from '../../utils/directoryPrompt';
import exec from '../../utils/exec';

const vuexStoreTemplate = fs.readFileSync(
  path.resolve(__dirname, '..', '..', 'templates/vuex/store.js'),
  'utf8',
);

/**
 * Choose additional plugins to install on the go
 *
 * @returns {Promise<void>}
 */

const addPlugins = async (args) => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Global reference to the directory of choice
  let templateDir = 'client';

  // Get to know whether the plugins are to be installed for client/server directory
  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  }

  const { template } = appData();

  // Vuetify bindings for Nuxt-js
  if (template === 'Nuxt-js') args.push('@nuxtjs/vuetify');

  // Install the opted plugins
  await exec(
    `npm install --save ${args.join(' ')}`,
    `Installing ${args.join(', ')}`,
    'Done',
    {
      cwd: templateDir,
    },
  );

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
      '  buildModules: [',
      '    // Simple usage',
      `    '@nuxtjs/vuetify',`,
      '',
      '    // With options',
      '    [',
      `      '@nuxtjs/vuetify',`,
      '      {',
      '        /* module options */',
      '      }',
      '    ]',
      '  ],',
    ];

    // Configure vuex-store for Nuxt-js template
    if (args.includes('vuex')) {
      // Navigate to the store directory and create a basic store template file
      fs.writeFileSync(
        './client/store/index.js',
        vuexNuxtStoreTemplate.join('\n'),
      );
    }

    // Configure @nuxtjs/vuetify
    if (args.includes('vuetify')) {
      // Read initial content from nuxt.config.js
      let nuxtConfig = fs
        .readFileSync('./nuxt.config.js', 'utf8')
        .toString()
        .split('\n');

      // Find the position of link within header information
      const indexOfLink = nuxtConfig.indexOf(
        nuxtConfig.find((line) => line.includes('link')),
      );

      // Insert the respective content
      vuetifyConfig.forEach((item, i) =>
        nuxtConfig.splice(indexOfLink + i + 2, 0, item),
      );

      // Write back the updated content
      fs.writeFileSync('./client/nuxt.config.js', nuxtConfig.join('\n'));
    }
  } else {
    // Configure vuex-store
    if (args.includes('vuex')) {
      let config = fs
        .readFileSync('./client/src/main.js', 'utf8')
        .toString()
        .split('\n');

      // Creates a new store.js file within the client/src directory.
      fs.writeFileSync('./client/src/store.js', vuexStoreTemplate);

      // Fetch the index corresponding to the very first blank line
      const blankLineIndex = config.indexOf(config.find((line) => line === ''));

      // Inserting the import statement for vuex-store
      config.splice(blankLineIndex, 0, `import store from "./store";`);

      // Fetching the position where in which router is passed on to the Vue instance
      const routerIndex = config.indexOf(
        config.find((line) => line.trim() === 'router,'),
      );

      // Insert store just after router so that it gets passed on to the Vue instance
      config.splice(routerIndex + 1, 0, `  store,`);

      // Cleaning up
      if (args.includes('vuetify')) config.splice(blankLineIndex + 1, 1);

      // Write back the updated config
      fs.writeFileSync('./client/src/main.js', config.join('\n'));
    }

    // Configure vuetify
    if (args.includes('vuetify')) {
      let config = fs
        .readFileSync('./client/src/main.js', 'utf8')
        .toString()
        .split('\n');

      // Import Vuetify and minified css towards the top of the config file
      [
        `import Vuetify from 'vuetify';`,
        `import 'vuetify/dist/vuetify.min.css';`,
      ].forEach((item, i) => config.splice(i + 1, 0, item));

      // Fetch the index after which the respective config should come up
      const preIndex = config.indexOf(
        config.find((line) => line.includes('Vue.config.productionTip')),
      );

      // Inserting the respective Vuetify config
      ['Vue.use(Vuetify);', ''].forEach((item, i) =>
        config.splice(preIndex + i, 0, item),
      );

      // Write back the updated config
      fs.writeFileSync('./client/src/main.js', config.join('\n'));
    }
  }
};

module.exports = addPlugins;
