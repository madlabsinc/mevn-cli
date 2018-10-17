const fs = require('fs');
const shell = require('shelljs');
const cmd = require('node-cmd');
const inquirer = require('inquirer');
const chalk = require('chalk');
const logUpdate = require('log-update');
const elegantSpinner = require('elegant-spinner');
const showBanner = require('../external/banner');

let storeFile = fs.readFileSync(__dirname + '/files/vuex/store.js', 'utf8');
let frame = elegantSpinner();

let addPackagefn = () => {
  
  showBanner();

  setTimeout(() => {

  console.log('\n'); 
  let questions = [
    {
      type: 'list',
      name: 'packages',
      message: 'Which package do you want to install?',
      choices: ['vee-validate', 'axios', 'vuex']
    }
  ]

  let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);
    shell.cd('client');

    inquirer.prompt(questions)
      .then(answers => {

        let fetchSpinner = setInterval(() => {
          logUpdate(`Installing ${answers.packages} ` + chalk.cyan.bold.dim(frame()));
        }, 50);

        setTimeout(() => {
          if (answers.packages === 'vee-validate') {
            cmd.get('npm install vee-validate --save-dev', (err) => {
              clearInterval(fetchSpinner);
              logUpdate.clear();
              if(err){
                console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
                exit(1);
              }
              
              console.log(chalk.green.bold('Package added successfully'));
            })
          } else if(answers.packages === 'axios'){
            cmd.get('npm install axios --save', (err) => {
              clearInterval(fetchSpinner);
              logUpdate.clear();
              if(err){
                console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
                exit(1);
              }
              
              console.log(chalk.green.bold('Package added successfully'));
            })
          } else if(answers.packages === 'vuex'){
            cmd.get('npm install vuex --save', (err) => {
              clearInterval(fetchSpinner);
              logUpdate.clear();
              if(err){
                console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
                exit(1);
              }
              
              shell.cd('src');
              // Getting the file content as an array where each line represents each element.
              let config = fs.readFileSync('main.js', 'utf8').toString().split('\n');
              // Creates a new store.js file within the client/src directory.
              fs.writeFile('store.js', storeFile, (err) => {
                if(err){
                  throw err;
                }
              });
              // Iterates through the array, assuming that there is a blank line between import statements and rest part of the code.
              for(let index = 0; index < config.length; index++){
                if(config[index] === ''){
                  config[index] = 'import store from \'./store\';'
                  break;
              }
            }
              let content = config.join('\n');
              fs.writeFile('main.js', content, (err) => {
                if(err){
                  throw err;
                }
              });
              console.log(chalk.green.bold('Package added successfully. You can find a store file within the src directory!'));
            });
          }
        }, 100)
      })
    }, 1000);
}

module.exports = addPackagefn;