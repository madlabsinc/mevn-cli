'use strict';

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../utils/createFile');

exports.generateConfig = () => {
  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('config');

  inquirer.prompt([{
    name: 'db',
    type: 'input',
    message: 'Enter the url for the database : ',
  }]).then((answers) => {

    const content = 'module.exports = {\n  \'url\': "' + answers.db + '"\n}';

    createFile('./config.js', content, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  });
};
