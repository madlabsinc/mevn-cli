
'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');
const { appData } = require('../../utils/projectConfig');

let projectName;
let deleteCommand; // Delete .git based on the platform

exports.createRepo = () => {
  showBanner();

  return new Promise((resolve,reject)=>{
    
    setTimeout(() => {
      configFileExists();
  
      appData().
      then((data) => {
        projectName = data.projectName;
      });
  
      if (!shell.which('git')) {
        shell.echo('Sorry, git is not installed on your system, Do you want to install git?');
        inquirer.prompt([{
          name: 'answer',
        }]).then((answers) => {
          if(answers.answer === 'y' || answers.answer === 'yes'){
            // install git for linux
            if(process.platform === 'linux'){
              shell.exec('sudo apt-get update', error1(err) );
            }
            // install git for Mac
            else if(process.platform === 'darwin'){
              shell.exec('brew install git', error2(err));
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
        console.log('\ncreating github repository');
        inquirer.prompt([{
          name: 'username',
          type: 'input',
          message: 'Enter the username: '
  
        }]).then((answers) => {
  
          shell.exec('curl -u \'' + answers.username + '\' https://api.github.com/user/repos -d \'{"name":"' + projectName + '"}\'', error3(err));
        });
      
      }
    
    }, 100);
  });
};



function error1(err){
  if(err){
    throw err;
  }
  else{
    shell.exec('sudo apt-get install git', error11(err));
  }
}


function error2(err){
  if(err){
    shell.echo('There was some error encountered, please download git for Mac from the web!');
    throw err;
  }
  else{
    shell.echo('Git was installed successfully');
    shell.exit(1);
  }
}


function error3(err){
  if(err) {
    throw err;
  }
  if(process.platform === 'win32'){
    deleteCommand = 'del .git';
  } else{
    deleteCommand = 'rm -rf .git';
  }
  shell.exec(deleteCommand, error4(err));
}

function error4(err){
  if(err) {
    throw err;
  }
  shell.exec('git init', error9(err));
}

function error5(err){
  if(err) {
    throw err;
  }
  shell.exec('git commit -m \'first commit\'', error6(err));
}

function error6(err){
  if(err) {
    throw err;
  }
  shell.exec('git remote add origin https://github.com/' + answers.username + '/' + projectName + '.git', error7(err));
  console.log('\npushing local files to your github account');
  shell.exec('git push origin master', error8(err));
}

function error7(error){
  if(err) {
    throw err;
  }
}

function error8(err) {
  if(err) {
    throw err;
  }
}

function error9(err){
  if(err) {
    throw err;
  }
  shell.exec('git add .', error5(err));
}

function error11(err){
  if(err){
    throw err;
  }
  else{
    shell.echo('Git was installed successfully');
  }
}