'use strict';

import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import showBanner from 'node-banner';
import path from 'path';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import { validateInput } from '../../utils/validate';

/**
 * Converts a given string into lower camel case
 *
 * @param {String} str - Text to be converted
 * @returns {String}
 */

const toLowerCamelCase = str =>
  str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

/**
 * Generates a Vue SFC
 *
 * @returns {Promise<void>}
 */

const generateComponent = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  let { componentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'Kindly provide a name for the new component',
      validate: validateInput,
    },
  ]);

  // Convert component name to lower-camel-case
  componentName = toLowerCamelCase(componentName);

  // SFC template
  const componentTemplate = [
    '<template >',
    '<center>',
    '<br />',
    `<h1> This is the ${componentName} component </h1>`,
    '</center>',
    '</template>',
    '',
    '<script >',
    '    export default {',
    '        data() {',
    '            return {',
    '',
    '            }',
    '        },',
    '    } ',
    '</script>',
    '',
    '<style scoped >',
    '',
    '</style>',
  ];

  const { componentType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'componentType',
      message: 'Please choose the component type',
      choices: ['UI Component', 'Page Component (generates route)'],
    },
  ]);

  const { template } = appData();

  // Get to know whether the route config is to be touched
  let componentPath = '';
  if (componentType === 'UI Component') {
    componentPath =
      template === 'Nuxt-js' ? 'client/components' : 'client/src/components';
  } else {
    componentPath =
      template === 'Nuxt-js' ? 'client/pages' : 'client/src/views';
  }
  process.chdir(componentPath);

  // Duplicate component
  if (fs.existsSync(`${componentName}.vue`)) {
    console.log();
    console.log(chalk.cyan.bold(` Info: ${componentName}.vue already exists`));
    return;
  }

  fs.writeFileSync(`./${componentName}.vue`, componentTemplate.join('\n'));

  console.log(
    chalk.green.bold(
      `Successfully created ${componentName}.vue file on ${componentPath}`,
    ),
  );

  /**
   * Nuxt-js automatically sets up the routing configurations
   * only page components require adding a new entry in the route config
   */
  if (template === 'Nuxt-js' || componentType === 'UI Component') return;

  process.chdir(path.join(process.cwd(), '..'));

  let routesConfig = fs
    .readFileSync('./router.js', 'utf8')
    .toString()
    .split('\n');

  const postImportIndex = routesConfig.indexOf(
    routesConfig.find(item => item === ''),
  );

  // Add an import statement at the respective place
  routesConfig[
    postImportIndex
  ] = `import ${componentName} from "./views/${componentName}.vue";`;

  // Include a new line to compensate the previous addition
  routesConfig.splice(postImportIndex + 1, 0, '');

  // Fetch the index corresponding to route-config array closing bracket
  const routesArrayEndsWithIndex = routesConfig.indexOf(
    routesConfig.find(item => item.trim() === ']'),
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
  fs.writeFileSync('./router.js', routesConfig.join('\n'));
};

module.exports = generateComponent;
