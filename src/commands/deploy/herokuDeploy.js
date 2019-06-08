'use strict';

import execa from 'execa';
import inquirer from 'inquirer';
import showBanner from 'node-banner';

import { checkIfConfigFileExists } from '../../utils/messages';
import { validateInstallation } from '../../utils/validate';

const deployWithGit = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku via Git integration.
  try {
    Promise.all([
      await execa('heroku', ['login'], { stdio: 'inherit' }),
      await execa('heroku', ['create'], { stdio: 'inherit' }),
      await execa('git', ['push', 'heroku', 'master'], { stdio: 'inherit' }),
    ]);
  } catch (err) {
    process.exit(1);
  }
};

const deployWithDocker = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku as a Docker container.
  try {
    Promise.all([
      await execa('heroku', ['login'], { stdio: 'inherit' }),
      await execa('heroku', ['container:login'], { stdio: 'inherit' }),
      await execa('heroku', ['create'], { stdio: 'inherit' }),
      await execa('heroku', ['container:push', 'web'], { stdio: 'inherit' }),
      await execa('heroku', ['container:release', 'web'], { stdio: 'inherit' }),
      await execa('heroku', ['open'], { stdio: 'inherit' }),
    ]);
  } catch (err) {
    process.exit(1);
  }
};

const deploy = async () => {
  await showBanner('Mevn CLI', 'Light speed setup for MEVN stack based apps.');
  checkIfConfigFileExists();

  await Promise.all([
    await validateInstallation('heroku'),
    await validateInstallation('git help -g'),
    await validateInstallation('rb'),
  ]);

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

module.exports = deploy;
