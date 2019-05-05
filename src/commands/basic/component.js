'use strict';

import chalk from 'chalk';
import fs from 'fs';

import { appData } from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
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

  if (fs.existsSync(`${componentName}.vue`)) {
    console.log(
      chalk.cyan.bold(`\n Info: ${componentName}.vue already exists`),
    );
    process.exit(1);
  }

  fs.writeFileSync(`${componentName}.vue`, componentTemplate.join('\n'));

  // Nuxt-js automatically sets up the routing configurations
  if (template === 'Nuxt-js') process.exit(1);

  let routeConfig = {
    path: '/',
    name: '',
    component: '',
  };

  routeConfig.path = `/${componentName.toLowerCase()}`;
  routeConfig.name = componentName;
  routeConfig.component = `${componentName}`;

  console.log(
    chalk.cyan.bold(
      `\n Kindly insert this object to the routes array within ${chalk.yellow.bold(
        'src/router/index.js',
      )}`,
    ),
  );
  console.log(chalk.green.bold(`\n  {`));
  Object.keys(routeConfig).map(key =>
    console.log(chalk.green.bold(`\t${key}: ${routeConfig[key]}`)),
  );
  console.log(chalk.green.bold(`\n  }`));
  /*

  process.chdir('../router');

  let routesFile = fs
    .readFileSync('./index.js', 'utf8')
    .toString()
    .split('\n');

  // Initial route configurations
  let routes = [];
  let routesData = [];

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

  // Fetching all the post import statements just above routes configuration.
  routesFile.some(item => {
    let index = routesFile.indexOf(item);
    if (index === 7) {
      return true;
    }
    if (index >= 3) {
      postImportConfig.push(item);
    }
  });
  // Fetching the route config object entries.
  const routesIndex = routesFile.indexOf(
    routesFile.find(item => item.includes('routes')),
  );
  routesFile.some(item => {
    let index = routesFile.indexOf(item);
    if (item === '  ]') {
      return true;
    }
    if (index > routesIndex) {
      routesData.push(item);
    }
  });

  // Parsing the existing route config into `routes` array.
  let route = '';
  routesData.map(item => {
    if (item === '    }' || item === '    },') {
      routes.push(route);
      // routes.push(item);
    } else {
      route += `${item}\n`;
    }
  });

  // Filling up routes object entry for the respective component
  routeConfig.path = `/${componentName.toLowerCase()}`;
  routeConfig.name = componentName;
  routeConfig.component = `${componentName}`;

  // Pushing it to the routes array
  routes.push(JSON.stringify(routeConfig));

  const updatedRoutes = [].concat(
    importPaths,
    postImportConfig,
    ['  routes: ['],
    routes,
    ['})'],
  );
  console.log(updatedRoutes);
  fs.writeFileSync('./index.js', updatedRoutes.join('\n'), 'utf8');
*/
};
