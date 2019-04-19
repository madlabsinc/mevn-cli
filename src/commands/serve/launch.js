'use strict';

import chalk from 'chalk';
import opn from 'opn';
import shell from 'shelljs';

import { deferExec } from '../../utils/defer';
import Spinner from '../../utils/spinner';

exports.serveProject = async (launchCmd, projectTemplate) => {
  const installDepsSpinner = new Spinner(
    'Installing dependencies in the background. Hold on...',
  );
  installDepsSpinner.start();

  let rootPath = 'http://localhost';
  let port;

  if (launchCmd === 'npm run dev') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }
  shell.exec('npm install', { silent: true }, async err => {
    installDepsSpinner.stop();

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

    await deferExec(3500);
    opn(`${rootPath}:${port}`);
  });
};
