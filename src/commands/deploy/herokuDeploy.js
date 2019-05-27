'use strict';

import execa from 'execa';
import inquirer from 'inquirer';

import { checkIfConfigFileExists } from '../../utils/messages';
import { showBanner } from '../../external/banner';
import { validateInstallation } from '../../utils/validate';

const deployWithGit = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku via Git integration
  await execa('heroku', ['login'], { stdio: 'inherit' });
  await execa('heroku', ['create'], { stdio: 'inherit' });
  await execa('git', ['push', 'heroku', 'master'], { stdio: 'inherit' });
};

const deployWithDocker = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku as a Docker container
  await execa('heroku', ['login'], { stdio: 'inherit' });
  await execa('heroku', ['container:login'], { stdio: 'inherit' });
  await execa('heroku', ['create'], { stdio: 'inherit' });
  await execa('heroku', ['container:push', 'web'], { stdio: 'inherit' });
  await execa('heroku', ['container:release', 'web'], { stdio: 'inherit' });
  await execa('heroku', ['open'], { stdio: 'inherit' });
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
