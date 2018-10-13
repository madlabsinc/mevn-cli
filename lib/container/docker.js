const showBanner = require('../external/banner');
const cmd = require('node-cmd');
const fs = require('fs');
const elegantspinner = require('elegant-spinner');
const logupdate = require('log-update');
const chalk = require('chalk');
const shell = require('shelljs');

let dockerfn = () => {
  
  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);

  shell.cd(appname.project_name);

  /*let frame = elegantspinner();
  let runspinner = setInterval(() => {
    logupdate(chalk.green.bold('Please wait! ' + chalk.cyan.bold.dim(frame())));
  }, 500);*/

  setTimeout(() => {

    shell.exec('sudo -s');
    shell.exec('docker-compose up', {silent: true}, (err) => {
      
      if(err) {
        console.log(chalk.red.bold('something went wrong!'));
        exit(1);
      } else {
        console.log(chalk.green.bold('you\'re all set.'));
      }
    });
  }, 100)
  
}
module.exports = dockerfn;