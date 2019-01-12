'use strict';

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../utils/createFile');
const showBanner = require('../external/banner');
const logUpdate = require('log-update');
const elegantSpinner = require('elegant-spinner');
const cmd = require('node-cmd');

let routesPath = '/../files/routes/';
let routesFile = fs.readFileSync(__dirname + '/../files/routes/index.js', 'utf8');
let routesFileWithPassPort = fs.readFileSync(__dirname + '/../files/routes/index_with_passport.js', 'utf8');
let routesFileWithSocialMediaAuth = fs.readFileSync(`${__dirname}${routesPath}index_with_social_media_auth.js`, 'utf8');
let facebookRoutesFile = fs.readFileSync(`${__dirname}${routesPath}FacebookRoutes.js`, 'utf8');
let twitterRoutesFile = fs.readFileSync(`${__dirname}${routesPath}TwitterRoutes.js`, 'utf8');
let googleRoutesFile = fs.readFileSync(`${__dirname}${routesPath}GoogleRoutes.js`, 'utf8');
let frame = elegantSpinner();

// Questions if user wants to use passport package
// and social media for authentication
const questions = [
  {
    type: 'confirm',
    name: 'passportAuth',
    message: 'Do you want to use passport package for authentication?'
  }
];

const socialMediaAuthQuestions = [
  {
    type: 'confirm',
    name: 'socialMediaAuth',
    message: 'Do you want to use social media for authentication?'
  }
];

let callSpinner = (withSocialMediaAuth) => {
  let message = withSocialMediaAuth ? 'Installing passport and social media authentication packages'
    : 'Installing passport package';

    return setInterval(() => {
      logUpdate(message + chalk.cyan.bold.dim(frame()));
    }, 50);
};

let installPassportPackages = (withSocialMediaAuth, spinnerToClear) => {
  let command = withSocialMediaAuth ? 'npm install passport passport-facebook passport-twitter passport-google-oauth'
    : 'npm install passport';

  cmd.get(`${command} --save-dev`, err => {
    clearInterval(spinnerToClear);
    logUpdate.clear();

    if(err) {
      console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required package!'));
      process.exit(1);
    }

    console.log(chalk.green.bold('Package added successfully'));
    shell.cd('routes');

    if (withSocialMediaAuth) {
      // create file with passport and social media authentication
      createFile('./index.js', routesFileWithSocialMediaAuth, { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });

      // create files that have the configurations for the social media authentication
      createFile('./FacebookRoutes.js', facebookRoutesFile, { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });

      createFile('./TwitterRoutes.js', twitterRoutesFile, { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });

      createFile('./GoogleRoutes.js', googleRoutesFile, { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });

    } else {
      // create file only with passport authentication
      createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });
    }
  });

};

let routesfn = () => {

  showBanner();

  setTimeout(() => {

    console.log('\n');

    if(!fs.existsSync('./mevn.json')){
      console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
      process.exit(1);
    }

    let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);

    inquirer.prompt(questions)
      .then(answer => {
        if (answer.passportAuth) {
          shell.cd('server');
          // ask about social media authentication
          inquirer.prompt(socialMediaAuthQuestions)
            .then(socialMediaAuthAnswer => {
              let fetchSpinner = callSpinner(socialMediaAuthAnswer.socialMediaAuth);
              setTimeout(() => {
                installPassportPackages(socialMediaAuthAnswer.socialMediaAuth, fetchSpinner);
              }, 100);
            });
        } else {
          shell.cd('server/routes');
          createFile('./index.js', routesFile, { flag: 'wx' }, (err) => {
            if (err) throw err;
            console.log(chalk.yellow('File Created...!'));
          });
        }
      });
  }, 1000);
};

module.exports = routesfn;
