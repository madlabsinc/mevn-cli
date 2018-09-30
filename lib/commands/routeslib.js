const fs = require('fs');
const shell = require('shelljs');
//const os = require('os');
//const inquirer = require('inquirer');
const chalk = require('chalk');

let routesFile = fs.readFileSync(__dirname + '/files/routes/index.js', 'utf8'); 

let routesfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('routes');

  fs.writeFile('./index.js', routesFile, (err) => {
    if (err) {
      throw err
    } else {
      console.log(chalk.yellow('File created...!'));
    }
  })


}

exports.routesfunction = routesfunction;
