'use strict';

import execa from 'execa';
import inquirer from 'inquirer';

import { dependencyNotInstalled, showInstallationInfo } from './messages';
import exec from './exec';
import { isWin, isLinux } from './constants';
import Spinner from './spinner';

// Initialize the spinner.
const spinner = new Spinner();

/**
 * Helper method to validate installation.
 *
 * @param {String} dependency
 * @returns {Promise<boolean>}
 */

const dependencyIsInstalled = async (dependency) => {
  try {
    await execa.shell(dependency);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validates user input
 *
 * @param {String} componentName
 * @returns {Boolean}
 */

const validateInput = (componentName) => {
  if (!componentName) {
    console.log(`Can't be empty!`);
    return false;
  } else {
    return true;
  }
};

/**
 * Executes respective shell command
 *
 * @param {String} cmd
 * @returns {Promise<any>}
 */

/**
 * Triggers Git installation specific to the platform
 *
 * @returns{Promise<void>}
 */

const installGit = async () => {
  const url = 'https://git-scm.com/download/win';
  if (isWin) {
    showInstallationInfo('git', url);
  } else {
    const packageMgr = isLinux ? 'apt' : 'brew';
    await exec(`${packageMgr} install git`);
  }
};

/**
 * Triggers Docker installation specific to the platform
 *
 * @returns{Promise<void>}
 */

const installDocker = async () => {
  const urlMap = {
    win32:
      'https://hub.docker.com/editions/community/docker-ce-desktop-windows',
    darwin: 'https://docs.docker.com/docker-for-mac/install/',
  };

  if (isLinux) {
    await exec('apt install docker.io');
  } else {
    showInstallationInfo('docker', urlMap[process.platform]);
  }
};

/**
 * Installs respective package from the npm registry
 *
 * @returns{Promise<void>}
 */

const installNpmPackage = async (dependency) => {
  await exec(`npm install -g ${dependency}`);
};

/**
 * Validates installation
 *
 * @param {String} dependency
 * @returns {Promise<boolean>}
 */

const validateInstallation = async (dependency) => {
  const status = await dependencyIsInstalled(dependency);

  if (dependency.includes(' ')) {
    const sep = dependency.includes('-') ? '-' : '';
    dependency = dependency.split(sep)[0];
  }

  if (!status) {
    const { depToInstall } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'depToInstall',
        message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
      },
    ]);

    if (depToInstall) {
      spinner.text = `Installing ${dependency}`;
      spinner.start();

      if (dependency === 'git') {
        await installGit();
      } else if (dependency === 'docker') {
        await installDocker();
      } else {
        await installNpmPackage(dependency);
      }
    } else {
      dependencyNotInstalled(dependency);
    }
  }
};

module.exports = {
  validateInstallation,
  validateInput,
};
