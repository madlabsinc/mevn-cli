'use strict';

import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import path from 'path';

import exec from '../../utils/exec';

import {
  checkIfConfigFileExists,
  checkIfTemplateIsNuxt,
} from '../../utils/messages';

/**
 * Lazy load components
 *
 * @returns {Promise<void>}
 */

const asyncRender = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  await checkIfConfigFileExists();

  // Exit for the case of Nuxt.js boilerplate template
  checkIfTemplateIsNuxt();

  const routesConfigPath = path.join('client', 'src', 'router.js');
  const routesConfig = fs
    .readFileSync(routesConfigPath, 'utf8')
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

  // Warns the user if the list is empty
  if (!availableComponents.length) {
    console.log();
    console.log(
      chalk.cyan.bold(
        ' Info: All of the available components are dynamically imported',
      ),
    );
    return;
  }

  // Allow the user to choose his component of choice
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
      (item) => item === `import ${componentName} from ${componentImportPath}`,
    ),
  );

  // Find the index corresponding to name: ${componentName}.vue (within route-config)
  const componentNameIndex = routesConfig.indexOf(
    routesConfig.find(
      (item) => item.trim() === `name: "${componentName.toLowerCase()}",`,
    ),
  );

  // Update the respective route-config to use dynamic import statement
  routesConfig[
    componentNameIndex + 1
  ] = `\t  component: () => import("./views/${componentName}.vue")`;

  // Remove old import statement
  routesConfig.splice(regularImportIndex, 1);

  // Write back the updated route-config
  fs.writeFileSync(routesConfigPath, routesConfig.join('\n'));
  console.log();

  // Execute linter
  await exec(
    'npm run lint -- --fix',
    'Cleaning up',
    ` From now on ${componentName} will be rendered asynchronously`,
    {
      cwd: 'client',
    },
  );
};

module.exports = asyncRender;
