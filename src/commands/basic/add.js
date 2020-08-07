'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import dirOfChoice from '../../utils/directoryPrompt';
import exec from '../../utils/exec';
import inquirer from 'inquirer';

const vuexStoreTemplate = fs.readFileSync(
  path.resolve(__dirname, '..', '..', 'templates/vuex/store.js'),
  'utf8',
);

/**
 * Choose additional deps to install on the go
 *
 * @returns {Promise<void>}
 */

const addDeps = async (deps, { dev }) => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Global reference to the directory of choice
  let templateDir = 'client';

  // Get to know whether the deps are to be installed for client/server directory
  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  }

  const { template } = appData();

  // Do not proceed if the deps were not supplied
  if (
    !deps.length &&
    (templateDir === 'server' ||
      (templateDir === 'client' && template !== 'Nuxt.js'))
  ) {
    return console.log(
      chalk.yellow(' Please specify the dependencies to install'),
    );
  }

  const installFlag = dev ? '--save-dev' : '--save';

  // Install dependencies
  if (deps.length) {
    await exec(
      `npm install ${installFlag} ${deps.join(' ')}`,
      `Installing ${deps.join(', ')}`,
      'Dependencies are successfully installed',
      {
        cwd: templateDir,
      },
    );
  }

  // No need for further config
  if (dev) return;

  // Nuxt.js modules are installed via multiselect prompt
  if (template === 'Nuxt.js' && !deps.length) {
    // Supported Nuxt.js modules
    const nuxtModules = ['vuetify', 'pwa', 'axios', 'content'];

    // These doesn't require installation
    const nuxtAddons = ['vuex'];

    // Supported Nuxt.js buildModules
    const availableBuildModules = ['pwa', 'vuetify'];

    // Supported Nuxt.js modules
    const availableModules = nuxtModules.filter(
      (module) => !availableBuildModules.includes(module),
    );

    // Nuxt.js modules that are already installed and configured (.mevnrc)
    const { modules: configuredModules } = appData();

    // Nuxt.js modules that are available for installation
    const nuxtDeps = []
      .concat(nuxtModules, nuxtAddons)
      .filter((dep) => !configuredModules.includes(dep));

    const { installCandidate } = await inquirer.prompt([
      {
        name: 'installCandidate',
        type: 'checkbox',
        message: 'Choose the required Nuxt.js modules',
        choices: nuxtDeps,
      },
    ]);

    // Nuxt.js modules that are supposed to be installed
    const modules = installCandidate.filter((dep) =>
      availableModules.includes(dep),
    );

    // Add the @nuxtjs prefix
    const modulesWithPrefix = modules.map(
      (module) => `${module === 'content' ? '@nuxt' : '@nuxtjs'}/${module}`, // @nuxt/content has different prefix
    );

    // Check if there is atleast a dep to be installed
    if (modules.length) {
      await exec(
        `npm install --save ${modulesWithPrefix.join(' ')}`,
        `Installing ${modulesWithPrefix.join(', ')}`,
        'Succesfully installed opted Nuxt.js modules',
        {
          cwd: templateDir,
        },
      );
    }

    // Nuxt.js modules to be installed as a devDependency
    const buildModules = installCandidate.filter((dep) =>
      availableBuildModules.includes(dep),
    );

    // @nuxtjs/pwa and @nuxtjs/vuetify are supposed to be installed as a devDep
    if (buildModules.length) {
      // Add @nuxtjs prefix
      const buildModulesWithPrefix = buildModules.map(
        (buildModule) => `@nuxtjs/${buildModule}`,
      );

      // Install buildModules as a devDep
      await exec(
        `npm install --save-dev ${buildModulesWithPrefix.join(' ')}`,
        `Installing ${buildModulesWithPrefix.join(', ')}`,
        'Succesfully installed opted Nuxt.js buildModules',
        {
          cwd: templateDir,
        },
      );
    }

    // Holds reference to the project specific config (.mevnrc)
    const projectConfig = appData();

    // Read initial content from nuxt.config.js
    const nuxtConfig = fs
      .readFileSync('./client/nuxt.config.js', 'utf8')
      .toString()
      .split('\n');

    // Add 2 so that the content gets inserted at the right position
    const buildModulesIdx =
      nuxtConfig.findIndex((line) => line.includes('buildModules:')) + 2;

    const modulesIdx =
      nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

    // Opted Nuxt.js addons
    const addons = installCandidate.filter((dep) => nuxtAddons.includes(dep));

    // Configure vuex-store for Nuxt.js template
    if (addons.includes('vuex')) {
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

      // Navigate to the store directory and create a basic store template file
      fs.writeFileSync(
        './client/store/index.js',
        vuexNuxtStoreTemplate.join('\n'),
      );
    }

    // Configure @nuxtjs/vuetify
    if (buildModules.includes('vuetify')) {
      const vuetifyConfig = [
        `${' '.repeat(2)}vuetify: {`,
        `${' '.repeat(4)}/* module options */`,
        `${' '.repeat(2)}},`,
      ];
      nuxtConfig.splice(
        buildModulesIdx,
        0,
        `${' '.repeat(4)}'@nuxtjs/vuetify',`,
      );

      // Add 1 so that the content gets inserted after the buildModules array
      const buildModulesEndIdx =
        nuxtConfig.indexOf(`${' '.repeat(2)}],`, buildModulesIdx) + 1;

      // Add @nuxtjs/vuetify config beneath the buildModules array
      vuetifyConfig.forEach((config, idx) =>
        nuxtConfig.splice(buildModulesEndIdx + idx, 0, config),
      );
    }

    // Configure @nuxtjs/axios module
    if (modules.includes('axios')) {
      const axiosConfig = [
        `${' '.repeat(2)}axios: {`,
        `${' '.repeat(4)}// proxyHeaders: false`,
        `${' '.repeat(2)}},`,
      ];
      nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/axios',`);

      // Add 1 so that the content gets inserted after the modules array
      const modulesEndIdx =
        nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

      // Add @nuxtjs/axios config beneath the modules array
      axiosConfig.forEach((config, idx) =>
        nuxtConfig.splice(modulesEndIdx + idx, 0, config),
      );
    }

    // Configure @nuxtjs/pwa module
    if (buildModules.includes('pwa')) {
      nuxtConfig.splice(buildModulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/pwa',`);
    }

    // Configure @nuxtjs/content module
    if (modules.includes('content')) {
      const contentConfig = [
        `${' '.repeat(2)}content: {`,
        `${' '.repeat(4)} //Options`,
        `${' '.repeat(2)}},`,
      ];
      nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/content',`);

      const modulesEndIdx =
        nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

      // Add @nuxtjs/content config beneath the modules array
      contentConfig.forEach((config, idx) =>
        nuxtConfig.splice(modulesEndIdx + idx, 0, config),
      );
    }

    // Update modules entry with the installed Nuxt.js modules
    configuredModules.push(...[].concat(modules, buildModules, addons));

    // Update the modules entry
    projectConfig.modules = configuredModules;

    fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));

    // Write back the updated content
    fs.writeFileSync('./client/nuxt.config.js', nuxtConfig.join('\n'));
  } else {
    // Configure vuex-store
    if (deps.includes('vuex')) {
      const config = fs
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
      if (deps.includes('vuetify')) config.splice(blankLineIndex + 1, 1);

      // Write back the updated config
      fs.writeFileSync('./client/src/main.js', config.join('\n'));
    }

    // Configure vuetify
    if (deps.includes('vuetify')) {
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

module.exports = addDeps;
