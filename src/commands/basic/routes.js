'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import prompts from 'prompts';
import showBanner from 'node-banner';

import createFile from '../../utils/createFile';
import {
  checkIfConfigFileExists,
  checkIfServerExists,
} from '../../utils/messages';
import Spinner from '../../utils/spinner';

const routesPath = '/../../templates/routes/';
const routesFile = fs.readFileSync(
  __dirname + '/../../templates/routes/index.js',
  'utf8',
);
const routesFileWithPassPort = fs.readFileSync(
  __dirname + '/../../templates/routes/index_with_passport.js',
  'utf8',
);
const routesFileWithSocialMediaAuth = fs.readFileSync(
  `${__dirname}${routesPath}index_with_social_media_auth.js`,
  'utf8',
);
const facebookRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}FacebookRoutes.js`,
  'utf8',
);
const twitterRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}TwitterRoutes.js`,
  'utf8',
);
const googleRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}GoogleRoutes.js`,
  'utf8',
);

// Prompts the user for social media auth with passport middleware
const questions = [
  {
    type: 'confirm',
    name: 'passportAuth',
    message: 'Do you want to use passport package for authentication?',
  },
];

const socialMediaAuthQuestions = [
  {
    type: 'confirm',
    name: 'socialMediaAuth',
    message: 'Do you want to use social media for authentication?',
  },
];

/**
 * Returns a Spinner instance along with the respective text
 *
 * @param {Boolean} withSocialMediaAuth - Include social media auth
 * @returns {Spinner} - Spinner instance
 */

const startSpinner = withSocialMediaAuth => {
  const message = withSocialMediaAuth
    ? 'Installing passport and social media authentication packages'
    : 'Installing passport package';

  return new Spinner(message);
};

/**
 * Install the necessary passport social media auth dependencies
 *
 * @param {Boolean} withSocialMediaAuth - Include social media auth
 * @param {Spinner} spinner - Spinner instance
 * @returns {Promise<void>}
 */

const installPassportPackages = async (withSocialMediaAuth, spinner) => {
  let commandArgs = withSocialMediaAuth
    ? 'install passport passport-facebook passport-twitter passport-google-oauth'
    : 'install passport';

  try {
    await execa('npm', commandArgs.split(' '));
  } catch (err) {
    spinner.fail(
      `Something went wrong. Couldn't install the required package!`,
    );
    throw err;
  }

  spinner.succeed('Package added successfully');
  process.chdir('routes');

  if (withSocialMediaAuth) {
    // Create file with passport and social media auth configurations
    createFile(
      './index.js',
      routesFileWithSocialMediaAuth,
      { flag: 'wx' },
      err => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      },
    );

    // Create files that have the configurations for social media authentication
    createFile(
      './FacebookRoutes.js',
      facebookRoutesFile,
      { flag: 'wx' },
      err => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      },
    );

    createFile('./TwitterRoutes.js', twitterRoutesFile, { flag: 'wx' }, err => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });

    createFile('./GoogleRoutes.js', googleRoutesFile, { flag: 'wx' }, err => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  } else {
    // Create file only with passport auth configuration
    createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, err => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  }
};

/**
 * Generates routes file with the necessary CRUD operations boilerplate content
 *
 * @returns {Promise<void>}
 */

const generateRoute = async () => {
  await showBanner('MEVN CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();
  await checkIfServerExists();

  prompts(questions).then(answer => {
    if (answer.passportAuth) {
      process.chdir('server');
      // Ask whether if he/she require social media auth configurations
      prompts(socialMediaAuthQuestions).then(async socialMediaAuthAnswer => {
        let fetchSpinner = startSpinner(socialMediaAuthAnswer.socialMediaAuth);
        fetchSpinner.start();

        installPassportPackages(
          socialMediaAuthAnswer.socialMediaAuth,
          fetchSpinner,
        );
      });
    } else {
      process.chdir('server/routes');
      createFile('./index.js', routesFile, { flag: 'wx' }, err => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });
    }
  });
};

module.exports = generateRoute;
