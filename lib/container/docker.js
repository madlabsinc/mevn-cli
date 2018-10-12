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

  let frame = elegantspinner();
  let runspinner = setInterval(() => {
    logupdate(chalk.green.bold('Please wait! ' + chalk.cyan.bold.dim(frame())));
  }, 50);

 
  cmd.get('sudo docker-compose up', (err, data, stderr) => {

    clearInterval(runspinner);
    logupdate.clear();

    if(err) {
      console.log('Something went wrong!');
    }
    
  });  
 

}
module.exports = dockerfn;