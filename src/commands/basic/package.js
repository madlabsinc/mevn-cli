'use strict';

import execa from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';

import { configFileExists } from '../../utils/messages';
import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';
import Spinner from '../../utils/spinner';

let storeFile = fs.readFileSync(
  __dirname + '/../../templates/vuex/store.js',
  'utf8',
);

const installPackage = async packageToInstall => {
  const fetchSpinner = new Spinner(`Installing ${packageToInstall} `);
  fetchSpinner.start();

  try {
    await execa('npm', ['install', '--save', packageToInstall]);
  } catch (err) {
    fetchSpinner.fail(`Failed to install ${packageToInstall}`);
    throw err;
  }
  fetchSpinner.succeed(`Successfully installed ${packageToInstall}`);
};

exports.addPackage = async () => {
  showBanner();

  await deferExec(100);
  configFileExists();
  console.log('\n');
  let questions = [
    {
      type: 'list',
      name: 'package',
      message: 'Which package do you want to install?',
      choices: ['vee-validate', 'axios', 'vuex', 'vuetify'],
    },
  ];

  process.chdir('client');
  inquirer.prompt(questions).then(async userChoice => {
    await installPackage(userChoice.package);

    if (userChoice.package === 'vuex') {
      process.chdir('src');
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
    } else if (userChoice.package === 'vuetify') {
      process.chdir('src');
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
          rootComponent[index] = "<style src='vuetify/dist/vuetify.min.css'>";
          break;
        }
      }

      let rootContent = rootComponent.join('\n');
      fs.writeFile('App.vue', rootContent, err => {
        if (err) {
          throw err;
        }
      });
    }
  });
};
