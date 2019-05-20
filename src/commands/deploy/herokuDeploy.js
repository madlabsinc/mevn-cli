'use strict';

import { spawn } from 'child_process';
import inquirer from 'inquirer';

import { checkIfConfigFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validate';

const exec = cmd => {
  return new Promise(reject => {
    try {
      spawn(cmd.split(' ')[0], cmd.split(' ').slice(1), { stdio: 'inherit' });
    } catch (err) {
      reject(err);
    }
  });
};

const deployWithGit = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku via Git integration
  await exec('heroku login');
  await exec('heroku create');
  await exec('git push heroku master');
};

const deployWithDocker = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku as a Docker container
  await exec('heroku login');
  await exec('heroku container:login');
  await exec('heroku create');
  await exec('heroku container:push web');
  await exec('heroku container:release web');
  await exec('heroku open');
};

exports.deploy = async () => {
  await showBanner();
  checkIfConfigFileExists();
  await validateInstallation('heroku');

  const { mode } = await inquirer.prompt([
    {
      name: 'mode',
      type: 'list',
      choices: ['Deploy with Git', 'Deploy with Docker'],
      message: 'Choose your preferred mode',
    },
  ]);

  mode === 'Deploy with Git' ? deployWithGit() : deployWithDocker();
};
