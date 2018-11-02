const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');

const showBanner = require('../external/banner');

let dplyfn = () => {

  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);

  setTimeout(() => {

    /*console.log('\n');
    inquirer.prompt([{
      name: 'username',
      type: 'input',
      message: 'Enter the username: '
  
    }]).then((answers) => {

      shell.exec('curl -u \'' + answers.username + '\' https://api.github.com/user/repos -d \'{"name":"' + appname.project_name + '"}\'', (err) => {
        if(err) {
          throw err;
        }
        shell.exec('rm -rf .git', (err) => {
          if(err) {
            throw err;
          }
        })
      }) 
    })*/     
  }, 100);


}
module.exports = dplyfn;