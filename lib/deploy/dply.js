const fs = require('fs');
const shell = require('shelljs')
const inquirer = require('inquirer')

const showBanner = require('../external/banner');

let deployfn = () => {

  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);

  setTimeout(() => {

    inquirer.prompt([{
      name: 'username',
      type: 'input',
      message: 'Enter the username: '
  
    }]).then((answers) => {
      
      shell.exec('curl -u \'' + answers.username + '\' https://api.github.com/user/repos -d \'{"name":"' + appname.project_name + '"}\'')
    }) 
  }, 100) 

}
module.exports = deployfn;