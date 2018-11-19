const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const inquirer = require('inquirer');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const os = require('os');
const process = require('process');
const Table = require('cli-table');
const showBanner = require('../external/banner');
const boilerplate = require('../../config.json');

let serverCommands = new Table();
let generalCommands = new Table();

let frame = elegantSpinner();

let showTables = () => {

  console.log(chalk.yellow('server commands:-'));
  
  serverCommands.push({
    'mevn-cli create:model': 'To create models file'  
  }, {
    'mevn-cli create:route' : 'To create routes file'
  }, {
    'mevn-cli create:controller': 'To create controllers file'
  }, {
    'mevn-cli create:component': 'To create components file'
  },{
    'mevn-cli add:package': 'To add a package to the project'
  }, {
    'mevn-cli create:config': 'To create config file'
  });
  console.log(serverCommands.toString());

  console.log(chalk.yellow('\ncommands to run:-'));
  generalCommands.push({
    'mevn-cli version': 'Shows the current version and additional info'
  }, {
    'mevn-cli run:server': 'To run server'
  }, {
    'mevn-cli run:client': 'To run client'
  }, {
    'mevn-cli add:package': 'To add additional packages as required'
  }, {
    'mevn-cli create:component <component_name>': 'To create new components as required'
  }, {
    'mevn-cli codesplit <component_name>': 'To lazy load components as required'
  }, {
    'mevn-cli create:git-repo': 'To create a GitHub repository and fire the first commit'
  }, {
    'mevn-cli dockerize': 'To run the client and server in separate docker containers'
  }, {
    'mevn-cli deploy': 'To deploy the app to Heroku'
  });
  console.log(generalCommands.toString());

  console.log(chalk.redBright('\n\nwarning:'));
  console.log('Do not delete mevn.json file');

}

let initfn = (dir) => {

  showBanner();
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
      choices: ['basic', 'pwa', 'graphql']

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
    

      if (answers.initial + '' === 'basic') {
        
        shell.exec(`${boilerplate.basic}`, {silent: true}, {async: true});

        let fetchSpinner = setInterval(() => {
          logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
        }, 50); 

        setTimeout(() =>{
          
          console.log('\n');
          clearInterval(fetchSpinner);
          logUpdate.clear();
          showTables();
        
        }, 5000);

        if (os.type() + '' === 'Linux') {
          shell.exec('mv mevn-boilerplate ' + dir);
        } else if (os.type() + '' === 'Windows_NT') {
          shell.exec('ren mevn-boilerplate ' + dir);
        } else if (os.type() + '' === 'darwin') {
          shell.exec('mv mevn-boilerplate ' + dir);
        }

      } else if(answers.initial === 'pwa'){
        shell.exec(`${boilerplate.pwa}`, {silent: true}, {async: true});

        let pwafetchSpinner = setInterval(() => {
          logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
        }, 50);

        setTimeout(() =>{

          console.log('\n');
          clearInterval(pwafetchSpinner);
          logUpdate.clear();
          showTables();         

        }, 5000);

        if (os.type() + '' === 'Linux') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' === 'Windows_NT') {
          shell.exec('ren mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' === 'darwin') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        }
      } else{
        shell.exec(`${boilerplate.graphql}`, {silent: true}, {async: true});

        let pwafetchSpinner = setInterval(() => {
          logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
        }, 50);

        setTimeout(() =>{

          console.log('\n');
          clearInterval(pwafetchSpinner);
          logUpdate.clear();
          showTables();         

        }, 5000);

        if (os.type() + '' === 'Linux') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' === 'Windows_NT') {
          shell.exec('ren mevn-pwa-boilerplate ' + dir);
        } else if (os.type() + '' === 'darwin') {
          shell.exec('mv mevn-pwa-boilerplate ' + dir);
        }
      }

    })
  }, 1000);

}

module.exports = initfn;
