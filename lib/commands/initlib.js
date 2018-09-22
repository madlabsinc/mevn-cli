const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const inquirer = require('inquirer');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const os = require('os');
const process = require('process');
const Table = require('cli-table');
const heading = require('../external/figlet');
const boilerplate = require('../../config.json');

let serverCommands = new Table();
let generalCommands = new Table();

let frame = elegantSpinner();

let initfunction = (dir) => {

  heading.figletfunction();
  console.log('\n');
  
  let initialSpinner = setInterval(() => {
    logUpdate('Initializing ' + chalk.cyan.bold.dim(frame()));
  }, 50);

  setTimeout(() => {

    clearInterval(initialSpinner);
    logUpdate.clear();
    console.log('\n');
    
    inquirer.prompt([{
      name: 'initial',
      type: 'list',
      message: 'Please select one',
      choices: ['pwa', 'basic']
    }]).then((answers) => {
      fs.writeFile(os.homedir() + '/mevn.json', '{\n  \"project_name\": \"' + process.cwd() + '/' +  dir + '\"\n}', (err) => {
        if (err) {
          throw err;
        }
      });
    
      fs.writeFile('./mevn.json', '{\n  \"project_name\": \"' +  dir + '\"\n}', (err) => {
        if (err) {
          throw err;
        }
      });
    

      if (answers.initial + '' == 'basic') {
        
        shell.exec(`${boilerplate.basic}`, {silent: true}, {async: true});

        let fetchSpinner = setInterval(() => {
          logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
      }, 50); 

        setTimeout(() =>{

          clearInterval(fetchSpinner);
          logUpdate.clear();

          console.log(chalk.yellow('server commands:-'));
          serverCommands.push({
            'mevn-cli models': 'To create models file'  
          }, {
            'mevn-cli routes' : 'To create routes file'
          }, {
            'mevn-cli controllers': 'To create controllers file'
          }, {
            'mevn-cli config': 'To create config file'
          });
          console.log(serverCommands.toString());

          console.log(chalk.yellow('\ncommands to run:-'));
          generalCommands.push({
            'mevn-cli server': 'To run server'
          }, {
            'mevn-cli client': 'To run client'
          });
          console.log(generalCommands.toString());
          console.log(chalk.redBright('\n\nwarning:'));
          console.log('Do not delete mevn.json file');

        }, 5000);

        if (os.type() + '' == 'Linux') {
          shell.exec('mv mevn-boilerplate ' + dir);
        } else if (os.type() + '' == 'Windows_NT') {
          shell.exec('ren mevn-boilerplate ' + dir);
        } else if (os.type() + '' == 'darwin') {
          shell.exec('mv mevn-boilerplate ' + dir);
        }

      } else {
        shell.exec(`${boilerplate.pwa}`, {silent: true}, {async: true});

        let pwafetchSpinner = setInterval(() => {
          logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
      }, 50);

        setTimeout(() =>{
          console.log('\n');
          clearInterval(pwafetchSpinner);
          logUpdate.clear();
          console.log(chalk.yellow('server commands:-'));
          serverCommands.push({
            'mevn-cli models': 'To create models file'  
          }, {
            'mevn-cli routes' : 'To create routes file'
          }, {
            'mevn-cli controllers': 'To create controllers file'
          }, {
            'mevn-cli config': 'To create config file'
          });
          console.log(serverCommands.toString());

          console.log(chalk.yellow('\ngeneral commands:-'));
          generalCommands.push({
            'mevn-cli server': 'To run server'
          }, {
            'mevn-cli client': 'To run client'
          });
          console.log(generalCommands.toString());
          console.log(chalk.redBright('\n\nwarning:'));
          console.log(chalk.yellow('Do not delete mevn.json file');          

        }, 5000);

        if (os.type() + '' == 'Linux') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' == 'Windows_NT') {
          shell.exec('ren mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' == 'darwin') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        }
      }

    })
  }, 1000);

}

exports.initfunction = initfunction;