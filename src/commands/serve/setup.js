'use strict';

import inquirer from 'inquirer';
import shell from 'shelljs';

import { appData } from '../../utils/projectConfig';
import { configFileExists } from '../../utils/messages';
import { serveProject } from './launch';
import { showBanner } from '../../external/banner';

let projectTemplate;

exports.setupProject = () => {
  showBanner();
  configFileExists();

  setTimeout(() => {
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
        let launchCmd = choice.side === 'client' ? 'npm run dev' : 'npm start';

        await appData().then(data => {
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
