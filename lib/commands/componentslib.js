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
}

module.exports = componentsfn;