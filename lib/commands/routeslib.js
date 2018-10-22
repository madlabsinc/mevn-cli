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

let routesfn = () => {

  showBanner();

  setTimeout(() => {
    // Add question if user wants to use passport package for authentication
    console.log('\n'); 
    let questions = [
      {
        type: 'confirm',
        name: 'passportAuth',
        message: 'Do you want to use passport package for authentication?'
      }
    ]

    let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);


    inquirer.prompt(questions)
      .then(answer => {
        if (answer.passportAuth) {
          shell.cd('server');
          let fetchSpinner = setInterval(() => {
            logUpdate('Installing passport package'  + chalk.cyan.bold.dim(frame()));
          }, 50);

          // install package 
          setTimeout(() => {
            cmd.get('npm install passport --save-dev', (err) => {
              clearInterval(fetchSpinner);
              logUpdate.clear();
              if(err){
                console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required package!'));
                exit(1);
              }
            
              console.log(chalk.green.bold('Package added successfully'));
              
              shell.cd('routes');
              // create new index.js file with passport import
              createFile('./index.js', routesFileWithPassPort, { flag: 'wx' }, (err) => {
                if (err) throw err;
                console.log(chalk.yellow('File Created...!'));
              });
            })
          }, 100)
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
