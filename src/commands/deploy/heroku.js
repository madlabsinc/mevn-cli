'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';

import exec from '../../utils/exec';
import Spinner from '../../utils/spinner';
import { validateInput } from '../../utils/validate';
import { validateInstallation } from '../../utils/validate';

/**
 * Creates a new Heroku app
 *
 * @returns {Promise<void>}
 */

const createHerokuApp = async () => {
  const { appName } = await inquirer.prompt({
    name: 'appName',
    type: 'input',
    message: 'Enter a name for the app',
    validate: validateInput,
  });

  try {
    await execa.shell(`heroku create ${appName}`);
  } catch ({ stderr }) {
    console.log();
    console.log(chalk.red(stderr));
    console.log();
    await createHerokuApp();
  }
};

/**
 * Checks whether the user is logged in on Heroku
 *
 * @returns {Boolean}
 */

const isLoggedIn = async () => {
  try {
    await execa.shell('heroku whoami');
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Deploy the webapp to Heroku
 *
 * @returns {Promise<void>}
 */

const deployToHeroku = async () => {
  validateInstallation('heroku');
  validateInstallation('git help -g');

  const spinner = new Spinner(`We're getting things ready for you`);
  spinner.start();

  // Navigate to the client directory
  process.chdir('client');

  if (!fs.existsSync('.git')) {
    await execa.shell('git init');
  } else {
    const { stdout } = await execa.shell('git status');
    if (stdout.includes('nothing to commit')) {
      spinner.fail('No changes detected!');
      process.exit(1);
    }
  }

  const staticConfig = {
    root: 'dist',
    clean_urls: true,
    routes: {
      '/**': 'index.html',
    },
  };

  if (!fs.existsSync('./static.json')) {
    fs.writeFileSync('./static.json', JSON.stringify(staticConfig, null, 2));
  }

  const starterSource = [
    'const express = require("express");',
    'const serveStatic = require("serve-static");',
    'const path = require("path");',
    'app = express();',
    'app.use(serveStatic(path.join(__dirname, "dist")));',
    'const port = process.env.PORT || 80;',
    'app.listen(port);',
  ];

  let pkgJson = JSON.parse(fs.readFileSync('./package.json'));
  const postInstallScript = "if test \"$NODE_ENV\" = \"production\" ; then npm run build ; fi "; // eslint-disable-line
  pkgJson = {
    ...pkgJson,
    scripts: {
      ...pkgJson.scripts,
      postinstall: postInstallScript,
      start: 'node server.js',
    },
  };

  if (!fs.existsSync('./server.js')) {
    fs.writeFileSync('./server.js', starterSource.join('\n'));

    spinner.text = 'Installing dependencies';
    await exec(
      'npm install --save express serve-static',
      spinner,
      'Successully installed express and serve-static',
    );

    fs.writeFileSync('./package.json', JSON.stringify(pkgJson, null, 2));
  }

  if (!(await isLoggedIn())) {
    await execa.shell('heroku login', { stdio: 'inherit' });
  }

  const { stdout } = await execa.shell('git remote');
  if (!stdout.includes('heroku')) {
    await createHerokuApp();
  }

  await execa.shell('git add .');
  await execa.shell(`git commit -m "Add files"`);

  await execa.shell('git push heroku master', { stdio: 'inherit' });
  await execa.shell('heroku open');
};

module.exports = deployToHeroku;
