const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');

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

      shell.exec('curl -u \'' + answers.username + '\' https://api.github.com/user/repos -d \'{"name":"' + appname.project_name + '"}\'', (err) => {
        if(err) {
          throw err;
        }

        shell.exec('rm -rf .git', (err) => {
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

                shell.exec('git remote add origin git@github.com:' + answers.username + '/' + appaname.project_name + '.git', (err) => {
                  if(err) {
                    throw err;
                  }

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
    })      
  }, 100);


}
module.exports = deployfn;