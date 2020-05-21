'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';

import appData from '../../utils/projectConfig';
import { validateInput } from '../../utils/validate';
import { validateInstallation } from '../../utils/validate';

/**
 * Creates a new Heroku app
 *
 * @param {String} dir - Directory of choice
 * @returns {Promise<void>}
 */

const createHerokuApp = async (dir) => {
  const { appName } = await inquirer.prompt({
    name: 'appName',
    type: 'input',
    message: 'Enter a name for the app',
    validate: validateInput,
  });

  try {
    await execa.shell(`heroku create ${appName}`, { cwd: dir });
  } catch ({ stderr }) {
    console.log();
    console.log(chalk.red(stderr));
    console.log();
    await createHerokuApp(dir);
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
 * @param {String} templateDir - client/server
 * @returns {Promise<void>}
 */

const deployToHeroku = async (templateDir) => {
  await validateInstallation('heroku');
  await validateInstallation('git help -g');

  const projectConfig = appData();
  const { template } = projectConfig;
  const isPwa = projectConfig.hasOwnProperty('isPwa') && projectConfig.isPwa;

  if (!fs.existsSync(`./${templateDir}/.git`)) {
    await execa.shell('git init', { cwd: templateDir });
    const fileContent = fs.existsSync('./server/.env')
      ? 'node_modules\n.env'
      : 'node_modules';
    fs.writeFileSync(`./${templateDir}/.gitignore`, fileContent);
  } else {
    const { stdout } = await execa.shell('git status', { cwd: templateDir });
    if (stdout.includes('nothing to commit')) {
      console.error('No changes detected!');
      process.exit(1);
    }
  }

  // Necessary configurations that are specific to the client side
  if (templateDir === 'client') {
    const staticConfig = {
      root: 'dist',
      clean_urls: true,
      routes: {
        '/**': 'index.html',
      },
    };

    if (!fs.existsSync('./client/static.json')) {
      fs.writeFileSync(
        './client/static.json',
        JSON.stringify(staticConfig, null, 2),
      );
    }

    const starterSource = [
      'const express = require("express");',
      'const serveStatic = require("serve-static");',
      'const path = require("path");',
      'const app = express();',
      'app.use(serveStatic(path.join(__dirname, "dist")));',
      'const port = process.env.PORT || 80;',
      'app.listen(port);',
    ];

    let pkgJson = JSON.parse(fs.readFileSync('./client/package.json'));
    const buildCmd = `npm run ${template === 'Nuxt-js' ? 'generate' : 'build'}`;
    const postInstallScript = `if test \"$NODE_ENV\" = \"production\" ; then ${buildCmd} ; fi `; // eslint-disable-line
    pkgJson = {
      ...pkgJson,
      scripts: {
        ...pkgJson.scripts,
        postinstall: postInstallScript,
        start: 'node server.js',
      },
    };

    if (isPwa) {
      pkgJson.scripts['preinstall'] = 'npm install --save @nuxtjs/pwa';
    }

    if (!fs.existsSync('./client/server.js')) {
      fs.writeFileSync('./client/server.js', starterSource.join('\n'));
      pkgJson.scripts['preinstall'] = 'npm install --save express serve-static';
      fs.writeFileSync(
        './client/package.json',
        JSON.stringify(pkgJson, null, 2),
      );
    }
  }

  if (!(await isLoggedIn())) {
    await execa.shell('heroku login', { stdio: 'inherit', cwd: templateDir });
  }

  const { stdout } = await execa.shell('git remote', { cwd: templateDir });
  if (!stdout.includes('heroku')) {
    await createHerokuApp(templateDir);
  }

  if (templateDir === 'server' && fs.existsSync('./server/models')) {
    const { stdout } = await execa.shell('heroku config', { cwd: templateDir });
    if (!stdout.includes('DB_URL')) {
      const { uri } = await inquirer.prompt({
        type: 'password',
        name: 'uri',
        message: 'Please provide the path to a cloud based MongoDB URI',
        validate: validateInput,
      });
      await execa.shell(`heroku config:set DB_URL=${uri}`, {
        cwd: templateDir,
      });
    }
  }

  await execa.shell('git add .', { cwd: templateDir });
  await execa.shell(`git commit -m "Add files"`, { cwd: templateDir });

  await execa.shell('git push heroku master', {
    stdio: 'inherit',
    cwd: templateDir,
  });
  await execa.shell('heroku open', { cwd: templateDir });
};

module.exports = deployToHeroku;
