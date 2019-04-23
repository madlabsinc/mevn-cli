'use strict';

import execa from 'execa';
import opn from 'opn';

import { deferExec } from '../../utils/defer';
import Spinner from '../../utils/spinner';

exports.serveProject = async (projectTemplate, side) => {
  const installDepsSpinner = new Spinner(
    'Installing dependencies in the background. Hold on...',
  );
  installDepsSpinner.start();

  let rootPath = 'http://localhost';
  let port;

  if (side === 'client') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }
  try {
    await execa('npm', ['install']);
  } catch (err) {
    installDepsSpinner.fail(
      `Something went wrong. Couldn't install the dependencies!`,
    );
    throw err;
  }
  installDepsSpinner.succeed(`You're all set`);

  const launchSpinner = new Spinner(
    'The default browser will open up in a while',
  );
  launchSpinner.start();

  await require('child_process').spawn('npm', ['run', 'dev']);
  await deferExec(6000);
  opn(`${rootPath}:${port}`);
  launchSpinner.info(`Available on ${rootPath}:${port}`);
};
