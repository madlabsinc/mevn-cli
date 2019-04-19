'use strict';

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../../utils/createFile');
const logUpdate = require('log-update');
const elegantSpinner = require('elegant-spinner');
const cmd = require('node-cmd');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

let routesPath = '/../../templates/routes/';
let routesFile = fs.readFileSync(__dirname + '/../../templates/routes/index.js', 'utf8');
let routesFileWithPassPort = fs.readFileSync(__dirname + '/../../templates/routes/index_with_passport.js', 'utf8');
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

  cmd.get(`${command} --save-dev`, error1(err));

};

exports.generateRoute = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();
    console.log('\n');

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
          createFile('./index.js', routesFile, { flag: 'wx' }, error2(err));
        }
      });
  }, 1000);


  function error1(err){
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
      createFile('./index.js', routesFileWithSocialMediaAuth, { flag: 'wx' }, error2(err));

      // create files that have the configurations for the social media authentication
      createFile('./FacebookRoutes.js', facebookRoutesFile, { flag: 'wx' }, error2(err));

      createFile('./TwitterRoutes.js', twitterRoutesFile, { flag: 'wx' }, error2(err));

      createFile('./GoogleRoutes.js', googleRoutesFile, { flag: 'wx' }, error2(err));

    } else {
      // create file only with passport authentication
      createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, error2(err));
    }
  
  }

  function error2(err)
  {
    if (err) throw err;
    console.log(chalk.yellow('File Created...!'));
  }

};
