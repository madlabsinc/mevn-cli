'use strict';

import execa from 'execa';
import open from 'open';
import fs from 'fs';

import Spinner from '../../utils/spinner';

const configurePwaSupport = async templateDir => {
  let path = templateDir === 'client' ? 'mevn.json' : '../mevn.json';

  let configFile = JSON.parse(fs.readFileSync(path).toString());

  if (configFile['isPwa']) {
    // Install the nuxt-pwa package.
    try {
      await execa('npm', ['install', '@nuxtjs/pwa']);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    if (templateDir === 'server') process.chdir('../');

    const nuxtConfigFile = fs
      .readFileSync('nuxt.config.js')
      .toString()
      .split('\n');

    let index = nuxtConfigFile.indexOf(
      nuxtConfigFile.find(line => line.includes('modules: [')),
    );

    nuxtConfigFile[index] = ` modules: ['@nuxtjs/pwa',`;
    fs.writeFileSync('nuxt.config.js', nuxtConfigFile.join('\n'));
  }
};

exports.serveProject = async (projectTemplate, templateDir) => {
  const installDepsSpinner = new Spinner(
    'Installing dependencies in the background. Hold on...',
  );
  installDepsSpinner.start();

  let rootPath = 'http://localhost';
  let port;

  if (templateDir === 'client') {
    port = projectTemplate === 'Nuxt-js' ? '3000' : '8080';
  } else {
    port = projectTemplate === 'graphql' ? '9000/graphql' : '9000/api';
  }
  try {
    await execa('npm', ['install']);
    if (projectTemplate === 'Nuxt-js') await configurePwaSupport(templateDir);
  } catch (err) {
    installDepsSpinner.fail(
      `Something went wrong. Couldn't install the dependencies!`,
    );
    throw err;
  }
  installDepsSpinner.succeed(`You're all set`);

  if (templateDir === 'server' && projectTemplate === 'Nuxt-js')
    process.chdir('server');

  const launchSpinner = new Spinner(
    'The default browser will open up in a while',
  );

  launchSpinner.start();
  Promise.all([execa.shell('npm run dev'), open(`${rootPath}:${port}`)]);
  launchSpinner.info(`Available on ${rootPath}:${port}`);
};
