'use strict';

import chalk from 'chalk';
import fs from 'fs';

import { appData } from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import { createFile } from '../../utils/createFile';
import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';

let componentTemplate = [
  '<template >',
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

const toLowerCamelCase = str => {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
};

exports.createComponent = async componentName => {
  showBanner();

  await deferExec(100);
  checkIfConfigFileExists();

  componentName = toLowerCamelCase(componentName);

  const { template } = await appData();
  const componentPath =
    template === 'Nuxt-js' ? 'pages' : 'client/src/components';
  process.chdir(componentPath);

  await createFile(
    `${componentName}.vue`,
    componentTemplate.join('\n'),
    { flag: 'wx' },
    err => {
      if (err) throw err;
      console.log(chalk.green('\n File Created...!'));
    },
  );

  // Nuxt-js automatically sets up the routing configurations
  if (template === 'Nuxt-js') process.exit(1);

  process.chdir('../router');

  let routesFile = fs
    .readFileSync('./index.js', 'utf8')
    .toString()
    .split('\n');

  // Initial route configurations
  let routes = [];
  let routeConfig = {
    path: '/',
    name: '',
    component: '',
  };

  routeConfig.name = template === 'pwa' ? 'Hello' : 'HelloWorld';
  routeConfig.component = template === 'pwa' ? `Hello` : `HelloWorld`;

  // Setting path and corresponding config for the new route.
  const componentImportPath = `'@/components/${componentName.toLowerCase()}'`;
  const importComponent = `import ${componentName} from ${componentImportPath}`;

  // Holds all the component path information defined within the routes config file.
  let importPaths = [];
  // To hold all the configurations that follows the import statements.
  let postImportConfig = [];

  // Fetching all the import statements
  routesFile.some(item => {
    if (item === '') return true;
    importPaths.push(item);
  });
  importPaths.push(importComponent);
  console.log(importPaths);

  const index = routesFile.indexOf(routesFile.find(item => item === ''));
  console.log(index);

  // Fetching all the post import statements just above routes configuration.
  routesFile.some(item => {
    if (routesFile.indexOf(item) === 7) {
      return true;
    }
    if (routesFile.indexOf(item) >= 3) {
      postImportConfig.push(item);
    }
  });
  console.log(postImportConfig);

  // Filling up routes object entry for the respective component
  routeConfig.path = `/${componentName.toLowerCase()}`;
  routeConfig.name = componentName;
  routeConfig.component = `${componentName}`;

  // Pushing it to the routes array
  routes.push(routeConfig);

  const updatedRoutesConfig = [].concat(importPaths, postImportConfig, routes);
  console.log(updatedRoutesConfig);
};
