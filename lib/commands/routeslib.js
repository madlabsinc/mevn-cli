const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../utils/createFile');
const showBanner = require('../external/banner');
const logUpdate = require('log-update');
const elegantSpinner = require('elegant-spinner');
const cmd = require('node-cmd');

let routesFile = fs.readFileSync(__dirname + '/files/routes/index.js', 'utf8');
let routesFileWithPassPort = fs.readFileSync(__dirname + '/files/routes/index_with_passport.js', 'utf8'); 
let frame = elegantSpinner();

// Questions if user wants to use passport package 
// and social media for authentication
const questions = [
  {
    type: 'confirm',
    name: 'passportAuth',
    message: 'Do you want to use passport package for authentication?'
  }
]

const socialMediaAuthQuestions = [
  {
    type: 'confirm',
    name: 'socialMediaAuth',
    message: 'Do you want to use social media for authentication?'
  }
]

callSpinner = (withSocialMediaAuth) => {
  let message = withSocialMediaAuth ? 'Installing passport and social media authentication packages'
    : 'Installing passport package'; 
  
    return setInterval(() => {
      logUpdate(message + chalk.cyan.bold.dim(frame()));
    }, 50)
}

installPassportPackages = (withSocialMediaAuth, spinnerToClear) => {
  let command = withSocialMediaAuth ? 'npm install passport passport-facebook passport-twitter passport-google-oauth'
    : 'npm install passport';

  cmd.get(`${command} --save-dev`, err => {
    clearInterval(spinnerToClear);
    logUpdate.clear();

    if(err) {
      console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required package!'));
      exit(1);
    }

    console.log(chalk.green.bold('Package added successfully'));
    shell.cd('routes');

    if (withSocialMediaAuth) {
      // create file with passport and social media authentication
      createFile('./indexWITHSOCIAL.js', routesFileWithPassPort, { flag: 'wx' }, (err) => {
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
  })

}

let routesfn = () => {

  showBanner();

  setTimeout(() => {
    
    console.log('\n'); 
    
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
              console.log('SOCIAL ANSWER:', socialMediaAuthAnswer);
              console.log('PASSPORT ANSWER:', answer);

              let fetchSpinner = callSpinner(socialMediaAuthAnswer.socialMediaAuth);
              setTimeout(() => {
                installPassportPackages(socialMediaAuthAnswer.socialMediaAuth, fetchSpinner);
              }, 100);
            })

          // // install package 
          // setTimeout(() => {
          //   cmd.get('npm install passport --save-dev', (err) => {
          //     clearInterval(fetchSpinner);
          //     logUpdate.clear();
          //     if(err){
          //       console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required package!'));
          //       exit(1);
          //     }
            
          //     console.log(chalk.green.bold('Package added successfully'));
              
          //     shell.cd('routes');
          //     // create new index.js file with passport import
          //     createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, (err) => {
          //       if (err) throw err;
          //       console.log(chalk.yellow('File Created...!'));
          //     });
          //   })
          // }, 100)
        } else {
          shell.cd('server/routes');
          createFile('./index.js', routesFile, { flag: 'wx' }, (err) => {
            if (err) throw err;
            console.log(chalk.yellow('File Created...!'));
          });
        }
      })
  }, 1000)
}

module.exports = routesfn;
