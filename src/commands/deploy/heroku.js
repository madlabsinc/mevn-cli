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
 * Set config variable
 *
 * @param {String} configVar - The config variable
 * @param {String} dir - Directory of choice
 * @param {String} value - Supply the value
 * @returns {Promise<void>}
 */

const setConfigVar = async (configVar, dir, value) => {
  const { stdout } = await execa.shell('heroku config', {
    cwd: dir,
  });
  if (!stdout.includes(configVar)) {
    if (configVar === 'DB_URL') {
      const { uri } = await inquirer.prompt({
        type: 'password',
        name: 'value',
        message: 'Please provide the path to a cloud based MongoDB URI',
        validate: validateInput,
      });
      value = uri;
    }
    await execa.shell(`heroku config:set ${configVar}=${value}`, {
      cwd: dir,
    });
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
  // Show up the login prompt if not logged in
  if (!(await isLoggedIn())) {
    await execa.shell('heroku login', { stdio: 'inherit', cwd: templateDir });
  }

  // Create a new Heroku app
  const { stdout } = await execa.shell('git remote', { cwd: templateDir });
  if (!stdout.includes('heroku')) {
    await createHerokuApp(templateDir);
  }

  // It depends on a DBAAS
  if (templateDir === 'server' && fs.existsSync('./server/models')) {
    await setConfigVar('DB_URL', templateDir);
  }

  // Necessary configurations that are specific to the client side
  if (templateDir === 'client') {
    // Nuxt.js with target server
    if (template === 'Nuxt.js') {
      // Set config vars via heroku-cli
      await setConfigVar('HOST', templateDir, '0.0.0.0');
      await setConfigVar('NODE_ENV', templateDir, 'production');

      // Create Procfile
      if (!fs.existsSync('./client/Procfile')) {
        fs.writeFileSync('./client/Procfile', 'web: nuxt start');
      }
    } else {
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
      const buildCmd = 'npm run build';
      const postInstallScript = `if test \"$NODE_ENV\" = \"production\" ; then ${buildCmd} ; fi `; // eslint-disable-line
      pkgJson = {
        ...pkgJson,
        scripts: {
          ...pkgJson.scripts,
          postinstall: postInstallScript,
          start: 'node server.js',
        },
      };

      if (!fs.existsSync('./client/server.js')) {
        fs.writeFileSync('./client/server.js', starterSource.join('\n'));
        pkgJson.scripts['preinstall'] =
          'npm install --save express serve-static';
        fs.writeFileSync(
          './client/package.json',
          JSON.stringify(pkgJson, null, 2),
        );
      }
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
