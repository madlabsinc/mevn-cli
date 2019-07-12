'use strict';

import chalk from 'chalk';
import fs from 'fs';
import showBanner from 'node-banner';

import {
  checkIfConfigFileExists,
  checkIfTemplateIsNuxt,
} from '../../utils/messages';

/**
 * Lazy load components
 *
 * @param {String} componentName - Name of the component to be rendered asynchronously
 * @returns {Promise<void>}
 */

const asyncRender = async componentName => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  await checkIfConfigFileExists();

  // Exit for the case of Nuxt-js boilerplate template
  checkIfTemplateIsNuxt();

  process.chdir('client/src');

  let routesConfig = fs
    .readFileSync('./router.js', 'utf8')
    .toString()
    .split('\n');

  const componentImportPath = `"./views/${componentName}.vue";`;

  // Validates whether if the respective component was already imported dynamically.
  const asyncIndex = routesConfig.indexOf(
    routesConfig.find(
      item =>
        item.trim() ===
        `component: () => import("./views/${componentName}.vue")`,
    ),
  );
  if (asyncIndex !== -1) {
    console.log();
    console.log(
      chalk.cyan.bold(` ${componentName} is already imported dynamically`),
    );
    process.exit(1);
  }

  // Validating further.
  const index = routesConfig.indexOf(
    routesConfig.find(
      item => item === `import ${componentName} from ${componentImportPath}`,
    ),
  );

  if (index === -1) {
    console.log();
    console.log(
      `${chalk.cyan.bold(` There isn't a component named ${componentName}`)}`,
    );
    process.exit(1);
  } else {
    routesConfig[
      index
    ] = `component: () => import("./views/${componentName}.vue")`;
  }

  fs.writeFileSync('./router.js', routesConfig.join('\n'));
  console.log();
  console.log(
    chalk.green.bold(
      ` From now on ${componentName} will be rendered asynchronously`,
    ),
  );
};

module.exports = asyncRender;
