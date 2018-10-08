const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const chalk = require('chalk')
const createFile = require('../utils/createFile');

let controllersFile = fs.readFileSync(__dirname + '/files/controllers/user_controller.js', 'utf8');

let controllersfn = () => {

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
}

module.exports = controllersfn;
