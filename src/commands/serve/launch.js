'use strict';

import execa from 'execa';
import opn from 'opn';
import fs from 'fs';

import Spinner from '../../utils/spinner';

const enablePwaSupport = async(template) => {
  if (template === 'Nuxt-js') {
    let configFile = JSON.parse(fs.readFileSync('mevn.json').toString());
    if (configFile['isPwa']) {
     // setup pwa support
      execa('npm', ['install', '@nuxtjs/pwa']);
      const nuxtConfigFile = fs.readFileSync('nuxt.config.js').toString().split('\n');
      let index = nuxtConfigFile.indexOf(
        nuxtConfigFile.find(line => line.includes('modules: [')),
      );
      nuxtConfigFile[index] = ` modules: ['@nuxtjs/pwa',`;
      fs.writeFileSync('nuxt.config.js', nuxtConfigFile.join('\n'))  
    }
  }
}

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
    await enablePwaSupport(projectTemplate);
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

  Promise.all([execa.shell('npm run dev'), opn(`${rootPath}:${port}`)]);
  launchSpinner.info(`Available on ${rootPath}:${port}`);
};
