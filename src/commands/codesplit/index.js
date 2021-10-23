'use strict';

import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import path from 'path';

import exec from '../../utils/exec';
import * as logger from '../../utils/logger';
import {
  checkIfConfigFileExists,
  fetchProjectConfig,
  readFileContent,
} from '../../utils/helpers';

/**
 * Lazy load components
 *
 * @returns {Promise<void>}
 */

export default async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  await checkIfConfigFileExists();

  // Exit for the case of Nuxt.js boilerplate template
  const { packageManager, template } = fetchProjectConfig();
  if (template === 'Nuxt.js') {
    logger.error(`\n You're having the Nuxt.js boilerplate template`);
    process.exit(1);
  }

  const routesConfigPath = path.join('client', 'src', 'router.js');
  const routesConfig = readFileContent(routesConfigPath);

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
    logger.info(
      '\n Info: All of the available components are dynamically imported',
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
  const args = packageManager === 'yarn' ? ['--fix'] : ['--', '--fix'];

  await exec(
    `${packageManager} run lint ${args.join(' ')}`,
    'Cleaning up',
    ` From now on ${componentName} will be rendered asynchronously`,
    {
      cwd: 'client',
    },
  );
};
