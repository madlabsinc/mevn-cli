'use strict';

import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
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

const asyncRender = async () => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  await checkIfConfigFileExists();

  // Exit for the case of Nuxt-js boilerplate template
  checkIfTemplateIsNuxt();

  process.chdir('client/src');

  let routesConfig = fs
    .readFileSync('./router.js', 'utf8')
    .toString()
    .split('\n');

  // Keep hold of regular imported components
  const availableComponents = [];

  // Populate the array with regular imported components
  routesConfig.some((item, index) => {
    if (item === '') return true;
    if (index >= 2) {
      availableComponents.push(item.split(' ')[1]);
    }
  });

  // Warn the user if the list is empty
  if (!availableComponents.length) {
    console.log();
    console.log(
      chalk.red.bold(
        ' Info: All of the available components are dynamically imported',
      ),
    );
    return;
  }

  const { componentName } = await inquirer.prompt({
    name: 'componentName',
    type: 'list',
    choices: availableComponents,
    message: 'Choose from below',
  });

  const componentImportPath = `"./views/${componentName}.vue";`;

  // Find index corresponding to the regular import statement
  const regularImportIndex = routesConfig.indexOf(
    routesConfig.find(
      item => item === `import ${componentName} from ${componentImportPath}`,
    ),
  );

  // Find the index corresponding to name: ${componentName}.vue (within route-config)
  const componentNameIndex = routesConfig.indexOf(
    routesConfig.find(
      item => item.trim() === `name: "${componentName.toLowerCase()}",`,
    ),
  );

  // Update the respective route-config to use dynamic import statement
  routesConfig[
    componentNameIndex + 1
  ] = `\t  component: () => import("./views/${componentName}.vue")`;

  // Remove old import statement
  routesConfig.splice(regularImportIndex, 1);

  fs.writeFileSync('./router.js', routesConfig.join('\n'));
  console.log();
  console.log(
    chalk.green.bold(
      ` From now on ${componentName} will be rendered asynchronously`,
    ),
  );
};

module.exports = asyncRender;
