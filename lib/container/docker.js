const showBanner = require('../external/banner');
const cmd = require('node-cmd');
const fs = require('fs');
const elegantspinner = require('elegant-spinner');
const logupdate = require('log-update');
const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');

let dockerfn = () => {
  
  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);

  shell.cd(appname.project_name);

  let frame = elegantspinner();
  let fetchSpinner = setInterval(() => {
    logupdate(chalk.green.bold('\nThis may take a while. Sit back and relax! ' + chalk.cyan.bold.dim(frame())));
  }, 50);
  setTimeout(() => {
    cmd.get('sudo -s', (err) => {
      if(err){
        throw err;
      } 
      cmd.get('docker-compose up', (err) => {
      clearInterval(fetchSpinner);
      logupdate.clear();
        if(err) {
          console.log(chalk.red.bold('something went wrong!'));
          process.exit(1);
        } else {
          console.log(chalk.green.bold('you\'re all set.'));
        }
      });
    })  
  }, 100)
  
}
module.exports = dockerfn;