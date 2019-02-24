'use strict';

const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const process = require('process');

const { configureProject } = require('./launch');
const showBanner = require('../external/banner');

let serverfn = () => {
  showBanner();
  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  configureProject('npm start');
};

module.exports = serverfn;
