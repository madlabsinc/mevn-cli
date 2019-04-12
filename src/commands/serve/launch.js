'use strict';

import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import logUpdate from 'log-update';
import opn from 'opn';
import shell from 'shelljs';

exports.serveProject = async (launchCmd, projectTemplate) => {
  let frame = elegantSpinner();
  let spinner = setInterval(() => {
    logUpdate(
      chalk.green.bold(
        '\n Installing dependencies in the background. Hold on... ',
      ) + chalk.cyan.bold.dim(frame()),
    );
  }, 50);
  let rootPath = 'http://localhost';
  let port;

  if (launchCmd === 'npm run dev') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }
  shell.exec('npm install', { silent: true }, async err => {
    clearInterval(spinner);
    logUpdate.clear();
    if (err) {
      console.log(
        chalk.red.bold(
          `Something went wrong. Couldn't install the required packages!`,
        ),
      );
      process.exit(1);
    }
    console.log(chalk.green.bold(`You're all set.`));
    try {
      await require('child_process').exec(launchCmd);
      console.log(
        chalk.cyan.bold(
          `\n Available on ${chalk.green.bold(`${rootPath}:${port}`)}`,
        ),
      );
    } catch (err) {
      throw err;
    }
    setTimeout(() => {
      opn(`${rootPath}:${port}`);
    }, 3500);
  });
};
