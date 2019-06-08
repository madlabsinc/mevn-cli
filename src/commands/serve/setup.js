'use strict';

import inquirer from 'inquirer';
import showBanner from 'node-banner';

import appData from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import serveProject from './launch';

let projectTemplate;

const setupProject = async () => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  inquirer
    .prompt([
      {
        name: 'side',
        type: 'list',
        message: 'Choose from below',
        choices: ['client', 'server'],
      },
    ])
    .then(async choice => {
      await appData().then(data => {
        projectTemplate = data.template;
      });

      if (choice.side === 'client') {
        if (projectTemplate !== 'Nuxt-js') {
          process.chdir('client');
        }
      } else {
        process.chdir('server');
      }
      serveProject(projectTemplate, choice.side);
    });
};

module.exports = setupProject;
