'use strict';

const chalk = require('chalk');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const opn = require('opn');
const shell = require('shelljs');

const { projectTemplate } = require('./setup');

exports.serveProject = async (launchCmd) => {
  let frame = elegantSpinner();
  let spinner = setInterval(() => {
    logUpdate(chalk.green.bold('\n Installing dependencies in the background. Hold on... ') + chalk.cyan.bold.dim(frame()));
  }, 50);
  let rootPath = 'http://localhost';
  let port;

  if (launchCmd === 'npm run dev') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
      port = projectTemplate === 'graphql' ? '9000/api' : '9000/graphql';
  }
  shell.exec('npm install', {silent: true}, async (err) => {
    clearInterval(spinner);
    logUpdate.clear();
    if(err) {
      console.log(chalk.red.bold(`Something went wrong. Couldn't install the required packages!`));
      process.exit(1);
    }
    console.log(chalk.green.bold(`You're all set.`));
    console.log(chalk.cyan.bold(`\n Available on ${chalk.green.bold(`${rootPath}:${port}`)}`));
    try {
      await require('child_process').exec(launchCmd);
    } catch (err) {
      throw err;
    }
    setTimeout(() => {
      opn(`${rootPath}:${port}`);
    }, 3000);
  });
};
