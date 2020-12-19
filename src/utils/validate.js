'use strict';

import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';

import exec from './exec';
import { isWin, isLinux } from './constants';
import Spinner from './spinner';

// Initialize the spinner.
const spinner = new Spinner();

// Helpers

/**
 * Shows installation information
 *
 * @param {String} depCandidate - The repective package to be installed
 * @param {String} url - Official downloads page url
 * @returns {Void}
 */

const showInstallationInfo = (depCandidate, url) => {
  const msg = ` You need to download ${depCandidate} from the official downloads page: ${url}`;
  console.log(chalk.cyan.bold(msg));
  process.exit(0);
};

/**
 * Helper method to validate installation
 *
 * @param {String} dependency
 * @returns {Promise<boolean>}
 */

const checkInstallationStatus = async (dependency) => {
  try {
    await execa.command(dependency);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Install Git for supported platforms, else show installation instructions
 *
 * @returns{Promise<void>}
 */

const installGit = () => {
  const url = 'https://git-scm.com/download/win';

  if (isWin) {
    return showInstallationInfo('git', url);
  }
  const packageMgr = isLinux ? 'apt' : 'brew';
  return exec(`${packageMgr} install git`);
};

/**
 * Install Docker for Linux platform, else show installation instructions
 *
 * @returns{Promise<void>}
 */

const installDocker = () => {
  const urlMap = {
    win32:
      'https://hub.docker.com/editions/community/docker-ce-desktop-windows',
    darwin: 'https://docs.docker.com/docker-for-mac/install/',
  };

  if (!isLinux) {
    return showInstallationInfo('docker', urlMap[process.platform]);
  }
  return exec('apt install docker.io');
};

// Exported methods

/**
 * Validates user input for input prompts
 *
 * @param {String} userInput
 * @returns {Boolean}
 */

export const validateInput = (userInput) => {
  if (!userInput) {
    return `Can't be empty!`;
  }
  return true;
};

/**
 * Checks if a necessary dependency is installed
 *
 * @param {String} dependency
 * @returns {Promise<Void>}
 */

export const validateInstallation = async (dependency) => {
  const isDepInstalled = await checkInstallationStatus(dependency);

  if (dependency.includes(' ')) {
    const sep = dependency.includes('-') ? '-' : '';
    dependency = dependency.split(sep)[0];
  }

  if (!isDepInstalled) {
    const { shouldInstallDep } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldInstallDep',
        message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
      },
    ]);

    if (!shouldInstallDep) {
      console.warn(
        chalk.yellow.bold(` Warning:- ${chalk.cyan.bold(
          `${dependency} is required to be installed`,
        )}
        `),
      );
      process.exit(1);
    }

    spinner.text = `Installing ${dependency}`;
    spinner.start();

    if (dependency === 'git') {
      return installGit();
    }
    if (dependency === 'docker') {
      return installDocker();
    }
    await exec(`npm install -g ${dependency}`);
  }
};
