'use strict';

const cmd = require('node-cmd');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const chalk = require('chalk');
const shell = require('shelljs');

exports.setupProject = (launchCmd) => {
  let frame = elegantSpinner();
  let spinner = setInterval(() => {
    logUpdate(chalk.green.bold('\n Installing dependencies in the background. Hold on... ') + chalk.cyan.bold.dim(frame()));
  }, 50);

  cmd.get('npm install', (err, data) => {
    clearInterval(spinner);
    logUpdate.clear();
    if(err) {
      console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
      process.exit(1);
    }
    console.log(data);
    console.log(chalk.green.bold('You\'re all set.'));
    setTimeout(() => {
      shell.exec(launchCmd);
    }, 200);
  });
};
