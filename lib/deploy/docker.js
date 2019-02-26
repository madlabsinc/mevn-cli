'use strict';

const { showBanner } = require('../external/banner');
const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');

exports.dockerize = () => {
  showBanner();
  
  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);

  shell.cd(appname.project_name);

  setTimeout(() => {
    // currently works on linux only
    if(os.type() + '' === 'Linux') {

      console.log('\n');
      shell.exec('sudo docker-compose up', (err) => {
        if(err) {
          console.log(chalk.red.bold('something went wrong!'));
          process.exit(1);
        } else {
          console.log('You are all set...!\nserver:- localhost:9000\nclient:- localhost:8080');
        }
      });
    }

  }, 100);
};
