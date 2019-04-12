'use strict';

import inquirer from 'inquirer';
import shell from 'shelljs';

import { appData } from '../../utils/projectConfig';
import { configFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validations';

let projectName;
let deleteCommand; // Delete .git based on the platform

exports.createRepo = () => {
  showBanner();

  setTimeout(async () => {
    configFileExists();
    validateInstallation('git');

    await appData().then(data => {
      projectName = data.projectName;
    });

    console.log('\ncreating github repository');
    inquirer
      .prompt([
        {
          name: 'username',
          type: 'input',
          message: 'Enter the username: ',
        },
      ])
      .then(answers => {
        shell.exec(
          "curl -u '" +
            answers.username +
            '\' https://api.github.com/user/repos -d \'{"name":"' +
            projectName +
            '"}\'',
          err => {
            if (err) {
              throw err;
            }
            if (process.platform === 'win32') {
              deleteCommand = 'del .git';
            } else {
              deleteCommand = 'rm -rf .git';
            }
            shell.exec(deleteCommand, err => {
              if (err) {
                throw err;
              }
              shell.exec('git init', err => {
                if (err) {
                  throw err;
                }
                shell.exec('git add .', err => {
                  if (err) {
                    throw err;
                  }
                  shell.exec("git commit -m 'first commit'", err => {
                    if (err) {
                      throw err;
                    }
                    shell.exec(
                      'git remote add origin https://github.com/' +
                        answers.username +
                        '/' +
                        projectName +
                        '.git',
                      err => {
                        if (err) {
                          throw err;
                        }
                      },
                    );
                    console.log('\npushing local files to your github account');
                    shell.exec('git push origin master', err => {
                      if (err) {
                        throw err;
                      }
                    });
                  });
                });
              });
            });
          },
        );
      });
  }, 100);
};
