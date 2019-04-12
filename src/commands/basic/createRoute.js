'use strict';

import chalk from 'chalk';
import cmd from 'node-cmd';
import elegantSpinner from 'elegant-spinner';
import fs from 'fs';
import inquirer from 'inquirer';
import logUpdate from 'log-update';
import shell from 'shelljs';

import { createFile } from '../../utils/createFile';
import { configFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';

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
let frame = elegantSpinner();

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

let callSpinner = withSocialMediaAuth => {
  let message = withSocialMediaAuth
    ? 'Installing passport and social media authentication packages'
    : 'Installing passport package';

  return setInterval(() => {
    logUpdate(message + chalk.cyan.bold.dim(frame()));
  }, 50);
};

let installPassportPackages = (withSocialMediaAuth, spinnerToClear) => {
  let command = withSocialMediaAuth
    ? 'npm install passport passport-facebook passport-twitter passport-google-oauth'
    : 'npm install passport';

  cmd.get(`${command} --save-dev`, err => {
    clearInterval(spinnerToClear);
    logUpdate.clear();

    if (err) {
      console.log(
        chalk.red.bold(
          "Something went wrong. Couldn't install the required package!",
        ),
      );
      process.exit(1);
    }

    console.log(chalk.green.bold('Package added successfully'));
    shell.cd('routes');

    if (withSocialMediaAuth) {
      // create file with passport and social media authentication
      createFile(
        './index.js',
        routesFileWithSocialMediaAuth,
        { flag: 'wx' },
        err => {
          if (err) throw err;
          console.log(chalk.yellow('File Created...!'));
        },
      );

      // create files that have the configurations for the social media authentication
      createFile(
        './FacebookRoutes.js',
        facebookRoutesFile,
        { flag: 'wx' },
        err => {
          if (err) throw err;
          console.log(chalk.yellow('File Created...!'));
        },
      );

      createFile(
        './TwitterRoutes.js',
        twitterRoutesFile,
        { flag: 'wx' },
        err => {
          if (err) throw err;
          console.log(chalk.yellow('File Created...!'));
        },
      );

      createFile('./GoogleRoutes.js', googleRoutesFile, { flag: 'wx' }, err => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });
    } else {
      // create file only with passport authentication
      createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, err => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });
    }
  });
};

exports.generateRoute = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();
    console.log('\n');

    inquirer.prompt(questions).then(answer => {
      if (answer.passportAuth) {
        shell.cd('server');
        // ask about social media authentication
        inquirer
          .prompt(socialMediaAuthQuestions)
          .then(socialMediaAuthAnswer => {
            let fetchSpinner = callSpinner(
              socialMediaAuthAnswer.socialMediaAuth,
            );
            setTimeout(() => {
              installPassportPackages(
                socialMediaAuthAnswer.socialMediaAuth,
                fetchSpinner,
              );
            }, 100);
          });
      } else {
        shell.cd('server/routes');
        createFile('./index.js', routesFile, { flag: 'wx' }, err => {
          if (err) throw err;
          console.log(chalk.yellow('File Created...!'));
        });
      }
    });
  }, 1000);
};
