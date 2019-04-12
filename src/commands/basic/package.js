'use strict';

import chalk from 'chalk';
import cmd from 'node-cmd';
import elegantSpinner from 'elegant-spinner';
import fs from 'fs';
import inquirer from 'inquirer';
import logUpdate from 'log-update';
import shell from 'shelljs';

import { configFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';

let storeFile = fs.readFileSync(
  __dirname + '/../../templates/vuex/store.js',
  'utf8',
);
let frame = elegantSpinner();

exports.addPackage = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();
    console.log('\n');
    let questions = [
      {
        type: 'list',
        name: 'packages',
        message: 'Which package do you want to install?',
        choices: ['vee-validate', 'axios', 'vuex', 'vuetify'],
      },
    ];

    shell.cd('client');
    inquirer.prompt(questions).then(answers => {
      let fetchSpinner = setInterval(() => {
        logUpdate(
          `Installing ${answers.packages} ` + chalk.cyan.bold.dim(frame()),
        );
      }, 50);

      setTimeout(() => {
        if (answers.packages === 'vee-validate') {
          cmd.get('npm install vee-validate --save-dev', err => {
            clearInterval(fetchSpinner);
            logUpdate.clear();
            if (err) {
              console.log(
                chalk.red.bold(
                  "Something went wrong. Couldn't install the required packages!",
                ),
              );
              process.exit(1);
            }

            console.log(chalk.green.bold('Package added successfully'));
          });
        } else if (answers.packages === 'axios') {
          cmd.get('npm install axios --save', err => {
            clearInterval(fetchSpinner);
            logUpdate.clear();
            if (err) {
              console.log(
                chalk.red.bold(
                  "Something went wrong. Couldn't install the required packages!",
                ),
              );
              process.exit(1);
            }

            console.log(chalk.green.bold('Package added successfully'));
          });
        } else if (answers.packages === 'vuex') {
          cmd.get('npm install vuex --save', err => {
            clearInterval(fetchSpinner);
            logUpdate.clear();
            if (err) {
              console.log(
                chalk.red.bold(
                  "Something went wrong. Couldn't install the required packages!",
                ),
              );
              process.exit(1);
            }

            shell.cd('src');
            // Getting the file content as an array where each line represents the corresponding element.
            let config = fs
              .readFileSync('main.js', 'utf8')
              .toString()
              .split('\n');
            // Creates a new store.js file within the client/src directory.
            fs.writeFile('store.js', storeFile, err => {
              if (err) {
                throw err;
              }
            });

            let storeNotImported = true;
            // Iterates through the array, assuming that there is a blank line between import statements and rest part of the code.
            for (let index = 0; index < config.length; index++) {
              if (config[index] === "import store from './store'") {
                break;
              }

              if (config[index] === '' && storeNotImported) {
                config[index] = "import store from './store'";
                storeNotImported = false;
              }

              // Searches for the line where Vue is getting instantiated
              if (config[index] === 'new Vue({') {
                // This is the first line after the creation of the Vue instance
                let indexWithin = index + 1;
                while (config[indexWithin] !== '})') {
                  // Terminating line of creating a Vue instance.
                  indexWithin++;
                }
                // Inserting store within the Vue instance
                let tempVal = config[indexWithin - 1];
                config[indexWithin - 1] = '  store,';
                config[indexWithin] = tempVal;
                config[indexWithin + 1] = '})';
              }
            }
            let content = config.join('\n');
            fs.writeFile('main.js', content, err => {
              if (err) {
                throw err;
              }
            });
            console.log(
              chalk.green.bold(
                'Package added successfully. You can find a store file within the src directory!',
              ),
            );
          });
        } else if (answers.packages === 'vuetify') {
          cmd.get('npm install --save vuetify', err => {
            clearInterval(fetchSpinner);
            logUpdate.clear();
            if (err) {
              console.log(
                chalk.red.bold(
                  "Something went wrong. Couldn't install the required packages!",
                ),
              );
              process.exit(1);
            }

            shell.cd('src');
            let config = fs
              .readFileSync('main.js', 'utf8')
              .toString()
              .split('\n');

            for (let index = 0; index < config.length; index++) {
              if (config[index] === "import Vuetify from './vuetify'") {
                break;
              }

              if (config[index] === '') {
                config[index] = "import Vuetify from 'vuetify'";
                config[index + 2] = 'Vue.use(Vuetify)';
                break;
              }
            }

            let content = config.join('\n');
            fs.writeFile('main.js', content, err => {
              if (err) {
                throw err;
              }
            });

            let rootComponent = fs
              .readFileSync('App.vue', 'utf8')
              .toString()
              .split('\n');

            for (let index = 0; index < rootComponent.length; index++) {
              if (rootComponent[index] === '<style>') {
                rootComponent[index] =
                  "<style src='vuetify/dist/vuetify.min.css'>";
                break;
              }
            }

            let rootContent = rootComponent.join('\n');
            fs.writeFile('App.vue', rootContent, err => {
              if (err) {
                throw err;
              }
            });

            console.log(chalk.green.bold('Package added successfully'));
          });
        }
      }, 100);
    });
  }, 1000);
};
