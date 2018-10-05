const fs = require('fs');
const shell = require('shelljs');
//const os = require('os');
//const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../utils/createFile');

let routesFile = fs.readFileSync(__dirname + '/files/routes/index.js', 'utf8'); 

let routesfn = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('routes');

  createFile('./index.js', routesFile, { flag: 'wx' }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('File Created...!'));
  });
}

exports.routesfn = routesfn;
