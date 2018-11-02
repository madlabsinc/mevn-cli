const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const chalk = require('chalk')
const createFile = require('../utils/createFile');

let componentsFile = fs.readFileSync(__dirname + '/files/components/component.vue', 'utf8');

let componentsfn = (componentName) => {
  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('client');
  shell.cd('src');
  shell.cd('components');
  
  createFile(componentName + '.vue', componentsFile, { flag: 'wx' }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('File Created...!'));
  });

  shell.cd('../router');

  let routeConfig = {
    path: '/' + componentName,
    name: componentName,
    component: componentName
  };

  let routesFile = fs.readFileSync('./index.js', 'utf8').toString().split('\n');
  // console.log(routesFile);
  for(let index = 0; index < routesFile.length; index++){
    if(routesFile[index] === '  ]'){
      routesFile[index - 1] = '\t},';

      let arrayClose = routesFile[index];
      let instanceClose = routesFile[index + 1];

      // Inserting new component route information as a new object within the routes array
      routesFile[index] = '\t{';
      routesFile[index + 1] = '\t path:' + '/\'' + componentName.toLowerCase() + '\'';
      routesFile[index + 2] = `\t name: '${componentName.charAt(0).toUpperCase()}'`;
      routesFile[index + 3] = `\t component: ${componentName.charAt(0).toUpperCase()}`;
      routesFile[index + 4] = '\t}'; 

      // Pushing all those closing brackets to the end inorder to make space
      // routesFile[index + 5] = arrayClose;
      // routesFile[index + 6] = instanceClose;
      console.log(arrayClose);
      console.log(instanceClose);
    }
  }
 fs.writeFile('./index.js', routesFile.join('\n'), (err) => {
    if(err){
      throw err;
    }
  }); 
}

module.exports = componentsfn;