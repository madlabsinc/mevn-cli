'use strict';

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { showBanner } = require('../external/banner');
let deleteCommand; // Delete .git based on the platform

exports.createRepo = () => {
  showBanner();

  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);

  setTimeout(() => {
    console.log('Create repo');
    if (!shell.which('git')) {
      shell.echo('Sorry, git is not installed on your system, Do you want to install git?');
      inquirer.prompt([{
        name: 'answer',
      }]).then((answers) => {
        if(answers.answer === 'y' || answers.answer === 'yes'){
          // install git for linux
          if(process.platform === 'linux'){
            shell.exec('sudo apt-get update', (err) => {
              if(err){
                throw err;
              }
              else{
                shell.exec('sudo apt-get install git', (err) => {
                  if(err){
                    throw err;
                  }
                  else{
                    shell.echo('Git was installed successfully');
                  }
                });
              }
            });
          }
          // install git for Mac
          else if(process.platform === 'darwin'){
            shell.exec('brew install git', (err) => {
              if(err){
                shell.echo('There was some error encountered, please download git for Mac from the web!');
                throw err;
              }
              else{
                shell.echo('Git was installed successfully');
                shell.exit(1);
              }
            });
          }
          //install git for Windows
          else if(process.platform === 'win32'){
            shell.echo('You need to go to the downloads page of git for Windows and install it');
            shell.exit(1);
          }
        }
        else{
          shell.echo('Git was not installed on your system, so your repository cannot be created');
          shell.exit(1);
        }
      });
    }
    else{
    //  stage 1
    console.log('\ncreating github repository');
    inquirer.prompt([{
      name: 'username',
      type: 'input',
      message: 'Enter the username: '

    }]).then((answers) => {

      shell.exec('curl -u \'' + answers.username + '\' https://api.github.com/user/repos -d \'{"name":"' + appname.project_name + '"}\'', (err) => {
        if(err) {
          throw err;
        }
        if(process.platform === 'win32'){
          deleteCommand = 'del .git';
        } else{
          deleteCommand = 'rm -rf .git';
        }
        shell.exec(deleteCommand, (err) => {
          if(err) {
            throw err;
          }
          shell.exec('git init', (err) => {
            if(err) {
              throw err;
            }
            shell.exec('git add .', (err) => {
              if(err) {
                throw err;
              }
              shell.exec('git commit -m \'first commit\'', (err) => {
                if(err) {
                  throw err;
                }
                shell.exec('git remote add origin https://github.com/' + answers.username + '/' + appname.project_name + '.git', (err) => {
                  if(err) {
                    throw err;
                  }
                });
                //stage 2
                console.log('\npushing local files to your github account');
                shell.exec('git push origin master', (err) => {
                  if(err) {
                    throw err;
                  }
                });
              });
            });
          });
        });
      });
    });
    }
  }, 100);
};
