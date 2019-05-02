'use strict';

// import execa from 'execa';
import { spawn } from 'child_process';
import inquirer from 'inquirer';

// import { appData } from '../../utils/projectConfig';
import { checkIfConfigFileExists } from '../../utils/messages';
import { deferExec } from '../../utils/defer';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validate';

const exec = cmd => {
  return new Promise((resolve, reject) => {
    try {
      spawn(cmd.split(' ')[0], cmd.split(' ').slice(1), { stdio: 'inherit' });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const deployWithGit = async () => {
  const commands = ['heroku login', 'heroku create', 'git push heroku master'];

  await exec(commands[0]);
};

const deployWithDocker = async () => {
  const commands = [
    'heroku login',
    'heroku container:login',
    'heroku create',
    'heroku container:push web',
    'heroku container:release web',
    'heroku open',
  ];

  await exec(commands[0]);
};

exports.deploy = async () => {
  showBanner();

  await deferExec(100);
  checkIfConfigFileExists();
  await validateInstallation('heroku');

  inquirer
    .prompt([
      {
        name: 'mode',
        type: 'list',
        choices: ['Deploy with Git', 'Deploy with Docker'],
        message: 'Choose your preferred mode',
      },
    ])
    .then(choice => {
      choice.mode === 'Deploy with Git' ? deployWithGit() : deployWithDocker();
    });
};
