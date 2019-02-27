'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');

const { showBanner } = require('../external/banner');
const { configFileExists } = require('../utils/messages');

exports.deploy = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    let appDir = process.cwd();
    shell.cd('client');

    shell.exec('npm install', (err) => {
      if(err) {
        throw err;
      }

      shell.exec('npm run build', (err) => {
        if(err) {
          throw err;
        }

        shell.exec('sudo cp -a /' + process.cwd() + '/dist /' + appDir + '/server', (err) => {
          if(err) {
            throw err;
          }

          shell.exec('cd ' + appDir + '/server', (err) => {
            if(err) {
              throw err;
            }

            shell.exec('sudo docker login --username=_ --password=$(heroku auth:token) registry.heroku.com', (err) => {
              if(err) {
                throw err;
              }
              console.log('\n\ncreating a heroku app\n');
              shell.exec('heroku create', (err) => {
                if(err) {
                  throw err;
                }

                inquirer.prompt([{
                  name: 'urlname',
                  type: 'input',
                  message: 'Please enter the name of heroku app(url)',

                }]).then((answers) => {

                  shell.exec('sudo heroku container:push web -a ' + answers.urlname, (err) => {
                    if(err) {
                      throw err;
                    }

                    shell.exec('sudo heroku container:release web -a ' + answers.urlname, (err) => {
                      if(err) {
                        throw err;
                      }

                      shell.exec('heroku open -a' + answers.urlname,(err) => {
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

        });

      });

    });

  }, 100);

};
