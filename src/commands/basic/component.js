'use strict';

import chalk from 'chalk';
import fs from 'fs';
import shell from 'shelljs';

import { configFileExists } from '../../utils/messages';
import { createFile } from '../../utils/createFile';
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

exports.createComponent = componentName => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    shell.cd('client/src/components');
    createFile(
      componentName + '.vue',
      componentTemplate.join('\n'),
      { flag: 'wx' },
      err => {
        if (err) throw err;
        console.log(chalk.green('\n File Created...!'));
      },
    );

    shell.cd('../router');

    let routesFile = fs
      .readFileSync('./index.js', 'utf8')
      .toString()
      .split('\n');

    // Setting path and corresponding config for the new route
    let componentPath = `'/${componentName.toLowerCase()}'`;

    // Capitalizing first letter of the component
    let component =
      componentName.charAt(0).toUpperCase() +
      componentName.substring(1, componentName.length);
    let componentImported = false;

    for (let index = 0; index < routesFile.length; index++) {
      if (routesFile[index] === '' && !componentImported) {
        routesFile[
          index
        ] = `import ${componentName} from '@/components/${componentName}'`;
        componentImported = true;
      }

      if (routesFile[index] === '  ]') {
        routesFile[index - 1] = '\t},';

        // Inserting new component route information as a new object within the routes array
        routesFile[index] = '\t{';
        routesFile[index + 1] = '\t path: ' + componentPath + ',';
        routesFile[index + 2] = `\t name: '${component}',`;
        routesFile[index + 3] = `\t component: ${component}`;
        routesFile[index + 4] = '\t}';

        // Pushing all those closing brackets to the end inorder to make space
        routesFile[index + 5] = ' ]';
        routesFile[index + 6] = '})';
      }
    }
    fs.writeFile('./index.js', routesFile.join('\n'), err => {
      if (err) {
        throw err;
      }
    });
  }, 100);
};
