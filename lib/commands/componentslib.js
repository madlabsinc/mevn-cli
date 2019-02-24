'use strict';

const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const createFile = require('../utils/createFile');


const showBanner = require('../external/banner');

let componentsFile = fs.readFileSync(__dirname + '/../files/components/component.vue', 'utf8');

let componentsfn = (componentName) => {
  showBanner();

  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('client');
  shell.cd('src');
  shell.cd('components');

  setTimeout(() => {

    createFile(componentName + '.vue', componentsFile, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log(chalk.green('\n File Created...!'));
    });

    shell.cd('../router');

    let routesFile = fs.readFileSync('./index.js', 'utf8').toString().split('\n');

    // Setting path and corresponding config for the new route
    let componentPath = `'/${componentName.toLowerCase()}'`;

    // Capitalizing first letter of the component
    let component = componentName.charAt(0).toUpperCase() + componentName.substring(1, componentName.length);
    let componentImported = false;

    for(let index = 0; index < routesFile.length; index++){

      if(routesFile[index] === '' && !componentImported){
        routesFile[index] = `import ${componentName} from '@/components/${componentName}'`;
        componentImported = true;
      }

      if(routesFile[index] === '  ]'){
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
   fs.writeFile('./index.js', routesFile.join('\n'), (err) => {
      if(err){
        throw err;
      }
    });
  }, 100);


};

module.exports = componentsfn;
