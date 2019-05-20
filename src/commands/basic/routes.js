'use strict';

import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';

import { createFile } from '../../utils/createFile';
import { checkIfConfigFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';
import Spinner from '../../utils/spinner';

let routesPath = '/../../templates/routes/';
let routesFile = fs.readFileSync(
  __dirname + '/../../templates/routes/index.js',
  'utf8',
);
let routesFileWithPassPort = fs.readFileSync(
  __dirname + '/../../templates/routes/index_with_passport.js',
  'utf8',
);
let routesFileWithSocialMediaAuth = fs.readFileSync(
  `${__dirname}${routesPath}index_with_social_media_auth.js`,
  'utf8',
);
let facebookRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}FacebookRoutes.js`,
  'utf8',
);
let twitterRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}TwitterRoutes.js`,
  'utf8',
);
let googleRoutesFile = fs.readFileSync(
  `${__dirname}${routesPath}GoogleRoutes.js`,
  'utf8',
);

// Questions if user wants to use passport package
// and social media for authentication
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

let startSpinner = withSocialMediaAuth => {
  let message = withSocialMediaAuth
    ? 'Installing passport and social media authentication packages'
    : 'Installing passport package';

  return new Spinner(message);
};

let installPassportPackages = async (withSocialMediaAuth, spinner) => {
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

exports.generateRoute = async () => {
  await showBanner();
  checkIfConfigFileExists();

  inquirer.prompt(questions).then(answer => {
    if (answer.passportAuth) {
      process.chdir('server');
      // Ask whether if he/she require social media auth configurations
      inquirer
        .prompt(socialMediaAuthQuestions)
        .then(async socialMediaAuthAnswer => {
          let fetchSpinner = startSpinner(
            socialMediaAuthAnswer.socialMediaAuth,
          );
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
