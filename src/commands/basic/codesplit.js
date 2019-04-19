'use strict';

const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

exports.asyncRender = (componentName) => {
    showBanner();

    setTimeout(() => {
      configFileExists();

      shell.cd('client/src/router');

      let componentNotFound = true;
      let routerFile = fs.readFileSync('./index.js', 'utf8').toString().split('\n');
      for (let index = 0; index < routerFile.length; index++) {
          // Checking whether the routes file already has the respective component
          if(routerFile[index].includes(`${componentName}`)){
            //  Validating whether the respective component is already imported dynamically
            if(routerFile[index].includes(`import ${componentName}`)){
              routerFile[index] = `const ${componentName} = () => import('@/components/${componentName}')`;
              componentNotFound = false;
              break;
              } else {
                  console.log(chalk.redBright(`\n ${componentName} component is already imported dynamically!`));
                  process.exit(1);
                }
            }
        }
        if (!componentNotFound) {
          fs.writeFile('./index.js', routerFile.join('\n'), error1(err));
        } else {
            console.log(chalk.yellowBright('\n Make sure that the component exists!'));
            process.exit(1);
        }
    }, 100);

    function error1(err)
    {
      if (err) {
        throw err;
      }
    }

};
