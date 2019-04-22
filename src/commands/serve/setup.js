'use strict';

import inquirer from 'inquirer';

import { appData } from '../../utils/projectConfig';
import { configFileExists } from '../../utils/messages';
import { deferExec } from '../../utils/defer';
import { serveProject } from './launch';
import { showBanner } from '../../external/banner';

let projectTemplate;

exports.setupProject = async () => {
  showBanner();
  configFileExists();

  await deferExec(200);
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
