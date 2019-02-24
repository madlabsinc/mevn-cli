'use strict';

const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const process = require('process');

const { setupProject } = require('./launch');
const { appData } = require('../utils/projectConfig');
const showBanner = require('../external/banner');

exports.setupClient = () => {
  showBanner();
  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  appData()
  .then((data) => {
    shell.cd(data.project_name);
    if (data.template !== 'Nuxt-js') {
      shell.cd('client');
    }
    setupProject('npm run dev');
  });
};
