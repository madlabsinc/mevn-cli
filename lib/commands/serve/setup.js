'use strict';

const inquirer = require('inquirer');
const shell = require('shelljs');

const { appData } = require('../../utils/projectConfig');
const { configFileExists } = require('../../utils/messages');
const { serveProject } = require('./launch');
const { showBanner } = require('../../external/banner');

let projectTemplate;

const setupProject = () => {
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

      if (choice.side === 'client') {
        await appData()
        .then((data) => {
          projectTemplate = data.template;
          if (data.template !== 'Nuxt-js') {
            shell.cd('client');
          }
        });
      } else {
        shell.cd('server');
      }
      serveProject(launchCmd);
    });
  }, 200);
};

Object.assign(exports, {setupProject, projectTemplate})
