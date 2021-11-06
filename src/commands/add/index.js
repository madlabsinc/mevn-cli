'use strict';

import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import path from 'path';

import exec from '../../utils/exec';
import {
  checkIfConfigFileExists,
  dirOfChoice,
  fetchProjectConfig,
  readFileContent,
} from '../../utils/helpers';
import * as logger from '../../utils/logger';

/**
 * Choose additional deps to install on the go
 *
 * @returns {Promise<void>}
 */

export default async (deps, { dev }) => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Global reference to the directory of choice
  let templateDir = 'client';

  // Get to know whether the deps are to be installed for client/server directory
  if (fs.existsSync('./server')) {
    ({ dir: templateDir } = await dirOfChoice());
  }

  const { isConfigured, template, packageManager } = fetchProjectConfig();

  // Do not proceed if the deps were not supplied
  if (!deps.length && templateDir === 'server') {
    logger.warn(' Please specify the dependencies to install');
    process.exit(1);
  }

  const installCmd =
    packageManager === 'npm'
      ? ['install', dev ? '--save-dev' : '--save']
      : ['add', dev && '--dev'].filter(Boolean);

  // Install dependencies
  if (deps.length) {
    await exec(
      `${packageManager} ${installCmd.join(' ')} ${deps.join(' ')}`,
      `Installing ${deps.join(', ')}`,
      'Dependencies were successfully installed',
      {
        cwd: templateDir,
      },
    );
  }

  // No need for further config
  if (dev) return;

  if (!deps.length) {
    // Nuxt.js modules are installed via multiselect prompt
    if (template === 'Nuxt.js' && !deps.length) {
      // Holds reference to the project specific config (.mevnrc)
      const projectConfig = fetchProjectConfig();

      // Nuxt.js modules that are already installed and configured (.mevnrc)
      const { modules: configuredModules, renderingMode } = projectConfig;

      // Supported Nuxt.js modules
      let nuxtModules = [
        'vuetify',
        'pwa',
        'axios',
        'content',
        'apollo',
        'oauth',
        'toast',
        'bulma',
        'tailwindcss',
        'storybook',
        'markdownit',
      ];
      if (renderingMode === 'spa') {
        // nuxt-oauth requires server rendered app
        nuxtModules = nuxtModules.filter((module) => module !== 'oauth');
      }

      // These addons doesn't require installation
      const nuxtAddons = ['vuex'];

      // Supported Nuxt.js buildModules
      const availableBuildModules = [
        'pwa',
        'vuetify',
        'storybook',
        'tailwindcss',
      ];

      // Supported Nuxt.js modules
      const availableModules = nuxtModules.filter(
        (module) => !availableBuildModules.includes(module),
      );

      // Nuxt.js modules that are available for installation
      const nuxtDeps = []
        .concat(nuxtModules, nuxtAddons)
        .filter((dep) => !configuredModules.includes(dep));

      if (!nuxtDeps.length) {
        logger.warn(' Please specify the dependencies to install');
        process.exit(1);
      }

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

      // Add the respective prefix
      const modulesWithPrefix = modules.map(
        (module) =>
          `${
            module === 'oauth'
              ? 'nuxt-oauth' // nuxt-oauth
              : module === 'content'
              ? `@nuxt/${module}`
              : `@nuxtjs/${module}`
          }`, // @nuxt/content has different prefix
      );

      // If the user opted for atleast a Nuxt.js module
      if (modules.length) {
        await exec(
          `${packageManager} install --save ${modulesWithPrefix.join(' ')}`,
          `Installing Nuxt.js modules`,
          'Successfully installed the opted Nuxt.js modules',
          {
            cwd: templateDir,
          },
        );
      }

      // Nuxt.js modules to be installed as a devDependency
      const buildModules = installCandidate.filter((dep) =>
        availableBuildModules.includes(dep),
      );

      // If the user opted for atleast a Nuxt.js buildModule
      if (buildModules.length) {
        // Add @nuxtjs prefix
        const buildModulesWithPrefix = buildModules.map(
          (buildModule) => `@nuxtjs/${buildModule}`,
        );

        const installCmd =
          packageManager === 'npm'
            ? ['install', '--save-dev']
            : ['add', '--dev'];

        // Install buildModules as a devDep
        await exec(
          `${packageManager} ${installCmd.join(
            ' ',
          )} ${buildModulesWithPrefix.join(' ')}`,
          `Installing Nuxt.js buildModules`,
          'Successfully installed the opted Nuxt.js buildModules',
          {
            cwd: templateDir,
          },
        );
      }

      // Read initial content from nuxt.config.js
      const nuxtConfigPath = path.join('client', 'nuxt.config.js');
      const nuxtConfig = readFileContent(nuxtConfigPath);

      // Add 2 so that the content gets inserted at the right position
      const buildModulesIdx =
        nuxtConfig.findIndex((line) => line.includes('buildModules:')) + 2;

      let modulesIdx =
        nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

      // Opted Nuxt.js addons
      const addons = installCandidate.filter((dep) => nuxtAddons.includes(dep));

      // Configure vuex-store for Nuxt.js template
      const configureNuxtVuexStore = () => {
        const vuexNuxtStoreTemplate = [
          'export const state = () => ({',
          '  counter: 0,',
          '})',
          '',
          'export const mutations = {',
          '  increment (state) {',
          '\tstate.counter++',
          '  },',
          '}',
        ];

        // Navigate to the store directory and create a basic store template file
        const storeFilePath = path.join('client', 'store', 'index.js');
        if (!fs.existsSync(storeFilePath)) {
          fs.writeFileSync(storeFilePath, vuexNuxtStoreTemplate.join('\n'));
        }
      };

      if (addons.includes('vuex')) {
        configureNuxtVuexStore();
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

      // Recompute since buildModules was updated
      modulesIdx =
        nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

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

      // Configure @nuxtjs/pwa buildModule
      if (buildModules.includes('pwa')) {
        nuxtConfig.splice(buildModulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/pwa',`);
      }

      // Recompute since buildModules was updated
      modulesIdx =
        nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

      // Configure @nuxt/content module
      if (modules.includes('content')) {
        const contentConfig = [
          `${' '.repeat(2)}content: {`,
          `${' '.repeat(4)} //Options`,
          `${' '.repeat(2)}},`,
        ];
        nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxt/content',`);

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add @nuxt/content config beneath the modules array
        contentConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );
      }

      // Configure @nuxtjs/apollo module
      if (modules.includes('apollo')) {
        const apolloConfig = [
          `${' '.repeat(2)}apollo: {`,
          `${' '.repeat(4)}clientConfigs: {`,
          `${' '.repeat(6)}default: {`,
          `${' '.repeat(8)}httpEndpoint: 'http://localhost:4000',`,
          `${' '.repeat(6)}}`,
          `${' '.repeat(4)}}`,
          `${' '.repeat(2)}},`,
        ];
        nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/apollo',`);

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add @nuxtjs/apollo config beneath the modules array
        apolloConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );
      }

      // Configure nuxt-oauth module
      if (modules.includes('oauth')) {
        const oAuthConfig = [
          `${' '.repeat(2)}oauth: {`,
          `${' '.repeat(4)}sessionName: 'mySession',`,
          `${' '.repeat(4)}secretKey: process.env.SECRET_KEY || 'SECRET_KEY',`,
          `${' '.repeat(4)}oauthHost: process.env.OAUTH_HOST || 'OAUTH_HOST',`,
          `${' '.repeat(
            4,
          )}oauthClientID: process.env.OAUTH_CLIENT_ID || 'OAUTH_CLIENT_ID',`,
          `${' '.repeat(
            4,
          )}oauthClientSecret: process.env.OAUTH_CLIENT_SECRET || 'OAUTH_CLIENT_SECRET',`,
          `${' '.repeat(4)}onLogout: (req, res) => {`,
          `${' '.repeat(6)}// do something after logging out`,
          `${' '.repeat(4)}},`,
          `${' '.repeat(4)}fetchUser: (accessToken, request) => {`,
          `${' '.repeat(6)}// do something to return the user`,
          `${' '.repeat(4)}},`,
          `${' '.repeat(2)}},`,
        ];
        nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'nuxt-oauth',`);

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add nuxt-oauth config beneath the modules array
        oAuthConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );

        // It requires Vuex Store to be activated
        configureNuxtVuexStore();
      }

      // Configure @nuxtjs/toast module
      if (modules.includes('toast')) {
        const toastConfig = [
          `${' '.repeat(2)}toast: {`,
          `${' '.repeat(4)}position: 'top-center',`,
          `${' '.repeat(4)}register: [ // Register custom toasts`,
          `${' '.repeat(4)}],`,
          `${' '.repeat(2)}},`,
        ];
        nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/toast',`);

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add @nuxtjs/toast config beneath the modules array
        toastConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );
      }

      // Configure @nuxtjs/tailwindcss buildModule
      if (buildModules.includes('tailwindcss')) {
        nuxtConfig.splice(
          buildModulesIdx,
          0,
          `${' '.repeat(4)}'@nuxtjs/tailwindcss',`,
        );
      }

      // Recompute since buildModules was updated
      modulesIdx =
        nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

      // Configure @nuxtjs/bulma module
      if (modules.includes('bulma')) {
        const postCssConfig = [
          `${' '.repeat(4)}postcss: {`,
          `${' '.repeat(6)}preset: {`,
          `${' '.repeat(8)}features: {`,
          `${' '.repeat(10)}customProperties: false`,
          `${' '.repeat(8)}}`,
          `${' '.repeat(6)}}`,
          `${' '.repeat(4)}},`,
        ];
        nuxtConfig.splice(modulesIdx, 0, `${' '.repeat(4)}'@nuxtjs/bulma',`);

        // Add 4 so that the content gets inserted at the right position
        const buildConfigIdx =
          nuxtConfig.findIndex((line) => line.includes('build:')) + 4;
        postCssConfig.forEach((config, idx) =>
          nuxtConfig.splice(buildConfigIdx + idx, 0, config),
        );
      }

      // Configure @nuxtjs/storybook buildModule
      if (buildModules.includes('storybook')) {
        const storybookConfig = [
          `${' '.repeat(2)}storybook: {`,
          `${' '.repeat(4)} // Options`,
          `${' '.repeat(2)}},`,
        ];

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add @nuxtjs/storybook config beneath the modules array
        storybookConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );

        // Update .gitignore
        const gitIgnorePath = path.join('client', '.gitignore');
        const gitIgnoreContent = readFileContent(gitIgnorePath);
        gitIgnoreContent.push('.nuxt-storybook', 'storybook-static');

        // Write back the updated file content
        fs.writeFileSync(gitIgnorePath, gitIgnoreContent.join('\n'));

        // Update .nuxtignore
        const nuxtIgnorePath = path.join('client', '.nuxtignore');
        if (fs.existsSync(nuxtIgnorePath)) {
          const nuxtIgnoreContent = readFileContent(nuxtIgnorePath);
          nuxtIgnoreContent.push('**/*.stories.js');

          // Write back the updated file content
          fs.writeFileSync(nuxtIgnorePath, nuxtIgnoreContent.join('\n'));
        } else {
          // Create.nuxtignore if it doesn't exist
          fs.writeFileSync(nuxtIgnorePath, '**/*.stories.js');
        }
      }

      // Recompute since buildModules was updated
      modulesIdx =
        nuxtConfig.findIndex((line) => line.includes('modules:')) + 2;

      // Configure @nuxtjs/markdownit module
      if (modules.includes('markdownit')) {
        const markdownitConfig = [
          `${' '.repeat(2)}markdownit: {`,
          `${' '.repeat(4)}preset: 'default',`,
          `${' '.repeat(4)}linkify: true,`,
          `${' '.repeat(4)}breaks: true,`,
          `${' '.repeat(4)}use: [`,
          `${' '.repeat(6)}'markdown-it-div',`,
          `${' '.repeat(6)}'markdown-it-attrs',`,
          `${' '.repeat(4)}],`,
          `${' '.repeat(2)}},`,
        ];
        nuxtConfig.splice(
          modulesIdx,
          0,
          `${' '.repeat(4)}'@nuxtjs/markdownit',`,
        );

        const modulesEndIdx =
          nuxtConfig.indexOf(`${' '.repeat(2)}],`, modulesIdx) + 1;

        // Add @nuxtjs/toast config beneath the modules array
        markdownitConfig.forEach((config, idx) =>
          nuxtConfig.splice(modulesEndIdx + idx, 0, config),
        );
      }

      // Update modules entry with the installed Nuxt.js modules
      const installedNuxtModules = [].concat(modules, buildModules, addons);
      if (
        installedNuxtModules.includes('oauth') &&
        !installedNuxtModules.includes('vuex')
      ) {
        // Vuex Store is activated with nuxt-oauth
        installedNuxtModules.push('vuex');
      }
      configuredModules.push(...installedNuxtModules);

      // Update the modules entry
      projectConfig.modules = configuredModules;

      if (!isConfigured[templateDir]) {
        // Additional dependencies were installed before invoking serve
        await exec(
          `${packageManager} install`,
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

      // Eslint
      const args = packageManager === 'yarn' ? ['--fix'] : ['--', '--fix'];
      await exec(
        `${packageManager} run lint ${args.join(' ')}`,
        'Cleaning up',
        'Fixed lint errors',
        {
          cwd: templateDir,
        },
      );

      fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));

      // Write back the updated content
      fs.writeFileSync(nuxtConfigPath, nuxtConfig.join('\n'));
    } else {
      const packagePrefixes = ['vue-cli-plugin', '@vue/cli-plugin'];
      const results = await Promise.all(
        packagePrefixes.map((pkg) =>
          execa.command(`npm search ${pkg} --parseable --no-description`),
        ),
      );

      const choices = results
        .map(({ stdout }) => stdout)
        .join('')
        .split('\n')
        .map((pkg) => pkg.split('\t')[0])
        .filter((pkg) =>
          packagePrefixes.some((pkgPrefix) => pkg.startsWith(pkgPrefix)),
        )
        .map((pkg) =>
          pkg.replace('vue-cli-plugin-', '').replace('@vue/cli-plugin-', ''),
        );

      const { plugins } = await inquirer.prompt({
        name: 'plugins',
        type: 'checkbox',
        message: 'Choose from below',
        choices,
      });

      plugins.forEach((plugin) =>
        execa.commandSync(`npx -y @vue/cli add ${plugin}`, {
          cwd: templateDir,
          stdio: 'inherit',
        }),
      );
    }
  }
};
