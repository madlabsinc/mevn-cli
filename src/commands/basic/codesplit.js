'use strict';

import chalk from 'chalk';
import fs from 'fs';

import { checkIfConfigFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';

exports.asyncRender = async componentName => {
  await showBanner();
  checkIfConfigFileExists();

  process.chdir('client/src/router');

  let routesConfig = fs
    .readFileSync('./index.js', 'utf8')
    .toString()
    .split('\n');

  const componentImportPath = `'@/components/${componentName}'`;

  // Validates whether if the respective component was already imported dynamically.
  const asyncIndex = routesConfig.indexOf(
    routesConfig.find(
      item =>
        item ===
        `const ${componentName} = () => import('@/components/${componentName}')`,
    ),
  );
  if (asyncIndex !== -1) {
    console.log(
      chalk.cyan.bold(`\n ${componentName} is already imported dynamically`),
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
    console.log(
      `${chalk.cyan.bold(`\n There isn't a component named ${componentName}`)}`,
    );
    process.exit(1);
  } else {
    routesConfig[
      index
    ] = `const ${componentName} = () => import('@/components/${componentName}')`;
  }

  fs.writeFileSync('./index.js', routesConfig.join('\n'));
  console.log(
    chalk.green.bold(
      `\n From now on ${componentName} will be rendered asynchronously`,
    ),
  );
};
