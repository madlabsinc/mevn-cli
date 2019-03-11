'use strict';

const inquirer = require('inquirer');
const shell = require('shelljs');

const { appData } = require('../../utils/projectConfig');
const { configFileExists } = require('../../utils/messages');
const { serveProject } = require('./launch');
const { showBanner } = require('../../external/banner');

let projectTemplate;

exports.setupProject = () => {
  showBanner();
  configFileExists();

  setTimeout(() => {
    inquirer.prompt([{
      name: 'side',
      type: 'list',
      message: 'Choose from below',
      choices: ['client', 'server']
    }])
    .then(async (choice) => {
      let launchCmd = choice.side === 'client' ? 'npm run dev' : 'npm start';

      await appData()
      .then((data) => {
        projectTemplate = data.template;
      });
      
      if (choice.side === 'client') {
        if (projectTemplate !== 'Nuxt-js') {
          shell.cd('client');
        }
      } else {
        shell.cd('server');
      }
      serveProject(launchCmd, projectTemplate);
    });
  }, 200);
};
