const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const os = require('os');
const createFile = require('../utils/createFile');

let userSchema = fs.readFileSync(__dirname + '/files/models/user_schema.js', 'utf8');

let modelsfn = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('models');

	if(os.type() === 'Linux' || os.type() === 'darwin'){
	  shell.exec('rm default.js', {silent: true}, () => {});
  } else{
	  shell.exec('del default.js', {silent: true}, () => {});
  }

  createFile('./user_schema.js', userSchema, { flag: 'wx' }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('File Created...!'));
  });
}

exports.modelsfn = modelsfn;
