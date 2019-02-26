'use strict';

const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const chalk = require('chalk');
const createFile = require('../utils/createFile');

let controllersFile = fs.readFileSync(__dirname + '/../templates/controllers/user_controller.js', 'utf8');

exports.generateController = () => {
  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('controllers');

  if(os.type() === 'Linux' || os.type() === 'darwin'){
	  shell.exec('rm default.js', {silent: true}, () => {});
  } else{
	  shell.exec('del default.js', {silent: true}, () => {});
  }

  createFile('./user_controller.js', controllersFile, { flag: 'wx' }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('File Created...!'));
  });
};
