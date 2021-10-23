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
import { validateInput } from '../../utils/validate';

/**
 * Converts a given string into lower camel case
 *
 * @param {String} str - Text to be converted
 * @returns {String}
 */

const toLowerCamelCase = (str) =>
  str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

/**
 * Generates a Vue SFC
 *
 * @returns {Promise<void>}
 */

export default async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  // Message to show up alongwith the spinner
  let progressMsg = 'Getting things ready';

  let { componentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'Please provide a name for the new component',
      validate: validateInput,
    },
  ]);

  // Fetch information specific to the project
  const projectConfig = fetchProjectConfig();
  const { isConfigured, packageManager, template } = projectConfig;

  const { componentType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'componentType',
      message: 'Please choose the component type',
      choices: ['UI Component', 'Page Component (generates route)'],
    },
  ]);

  // Convert component name to lower-camel-case
  if (!(template === 'Nuxt.js' && componentType !== 'UI Component')) {
    componentName = toLowerCamelCase(componentName);
  }

  // SFC template
  const componentTemplate = [
    '<template>',
    '  <center>',
    '    <br />',
    `    <h1>This is the ${componentName} component</h1>`,
    '  </center>',
    '</template>',
    '',
    '<script>',
    'export default {',
    '  data() {',
    '    return {}',
    '  }',
    '}',
    '</script>',
    '',
    '<style scoped></style>',
    '',
  ];

  // Get to know whether the route config is to be touched
  let componentPath = '';
  if (componentType === 'UI Component') {
    componentPath =
      template === 'Nuxt.js' ? 'client/components' : 'client/src/components';
  } else {
    componentPath =
      template === 'Nuxt.js' ? 'client/pages' : 'client/src/views';
  }

  // Duplicate component
  if (fs.existsSync(path.join(componentPath, `${componentName}.vue`))) {
    logger.info(`\n Info: ${componentName}.vue already exists`);
    return;
  }

  fs.writeFileSync(
    path.join(componentPath, `${componentName}.vue`),
    componentTemplate.join('\n'),
  );

  console.log();

  // Execute linter
  if (!isConfigured.client) {
    await exec(
      `${packageManager} install`,
      progressMsg,
      'Successfully installed the dependencies',
      { cwd: 'client' },
    );
    progressMsg = 'Cleaning up';

    // Update project specific dotfile
    projectConfig.isConfigured.client = true;
    fs.writeFileSync('.mevnrc', JSON.stringify(projectConfig, null, 2));
  }

  const args = packageManager === 'yarn' ? ['--fix'] : ['--', '--fix'];

  /**
   * Nuxt.js automatically sets up the routing configurations
   * only page components require adding a new entry in the route config
   */
  if (template === 'Nuxt.js' || componentType === 'UI Component') {
    return await exec(
      `${packageManager} run lint ${args.join(' ')}`,
      progressMsg,
      `Successfully created ${componentName}.vue file in ${componentPath}`,
      {
        cwd: 'client',
      },
    );
  }

  const routesConfigPath = path.join('client', 'src', 'router.js');
  const routesConfig = readFileContent(routesConfigPath);

  const postImportIndex = routesConfig.indexOf(
    routesConfig.find((item) => item === ''),
  );

  // Add an import statement at the respective place
  routesConfig[
    postImportIndex
  ] = `import ${componentName} from "./views/${componentName}.vue";`;

  // Include a new line to compensate the previous addition
  routesConfig.splice(postImportIndex + 1, 0, '');

  // Fetch the index corresponding to route-config array closing bracket
  const routesArrayEndsWithIndex = routesConfig.indexOf(
    routesConfig.find((item) => item.replace(',', '').trim() === ']'),
  );

  // Append a comma (},) to the previous component route-config delimiter
  routesConfig[routesArrayEndsWithIndex - 1] = '\t},';

  // Route config for generated component
  const routeConfigToAppend = [
    '\t{',
    `\t  path: "/${componentName.toLowerCase()}",`,
    `\t  name: "${componentName.toLowerCase()}",`,
    `\t  component: ${componentName}`,
    '\t}',
  ];

  // Append the route config for newly created component
  routeConfigToAppend.forEach((config, index) =>
    routesConfig.splice(routesArrayEndsWithIndex + index, 0, config),
  );

  // Write back the updated config
  fs.writeFileSync(routesConfigPath, routesConfig.join('\n'));

  // Execute linter
  await exec(
    `${packageManager} run lint ${args.join(' ')}`,
    progressMsg,
    `Successfully created ${componentName}.vue file in ${componentPath}`,
    {
      cwd: 'client',
    },
  );
};
