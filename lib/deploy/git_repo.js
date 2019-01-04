const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const showBanner = require('../external/banner');

let deleteCommand; // Delete .git based on the platform
let git_repofn = () => {

  showBanner();

  if(!fs.existsSync('./mevn.json')){
    console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
    process.exit(1);
  }

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);

  setTimeout(() => {

    //stage 1
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
                })
                //stage 2
                console.log('\npushing local files to your github account')
                shell.exec('git push origin master', (err) => {
                  if(err) {
                    throw err;
                  }
                })
              })
            })
          })
        })
      })
    })
  }, 100);


}
module.exports = git_repofn;
