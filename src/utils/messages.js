'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import appData from './projectConfig';

/**
 * Warns appropriately if the config file doesn't exist
 *
 * @returns {Void}
 */

export const checkIfConfigFileExists = () => {
  if (!fs.existsSync('./.mevnrc')) {
    console.log(
      chalk.cyan.bold(`\n\n Make sure that you're within a valid MEVN project
      \n${chalk.red.bold(' Error:')} No .mevnrc file found
    `),
    );
    process.exit(1);
  }
};

/**
 * Warns appropriately if the template chosen was GraphQL
 * where in which if the user opts to generate MVC files
 *
 * @returns {Void}
 */

export const templateIsGraphQL = () => {
  let msg = `GraphQL boilerplate doesn't include ${chalk.yellow.bold(
    `model, route and controller`,
  )} directories!`;
  console.log(
    chalk.red.bold(
      `\n Warning:- ${chalk.cyan.bold(`${msg}
    `)}`,
    ),
  );
  process.exit(1);
};

/**
 * Warns appropriately if the template chosen was Nuxt-js
 * for the respective cases
 *
 * @returns {Promise<void>}
 */

export const checkIfTemplateIsNuxt = async () => {
  const { template } = await appData();
  if (template === 'Nuxt-js') {
    console.log();
    console.log(
      chalk.red.bold(` You're having the Nuxt-js boilerplate template`),
    );
    process.exit(1);
  }
};

/**
 * Warns appropriately if the boilerplate template
 * doesn't include server directory
 *
 * @returns {Promise<void>}
 */

export const checkIfServerExists = async () => {
  if (!fs.existsSync(path.resolve(process.cwd(), 'server'))) {
    console.log();
    console.log(chalk.red.bold(` You aren't having a FullStack-app template`));
    process.exit(1);
  }
};

/**
 * Warns appropriately if the respective dependency wasn't installed
 *
 * @param {String} dependency - The dependency to be installed
 * @returns {Void}
 */

export const dependencyNotInstalled = dependency => {
  console.log(
    chalk.red.bold(` Warning:- ${chalk.cyan.bold(
      `${dependency} is required to be installed`,
    )}
    `),
  );
  process.exit(1);
};

/**
 * Shows installation information
 *
 * @param {String} depCandidate - The repective package to be installed
 * @param {Spinner} spinner - The spinner instance
 * @param {String} url - Official downloads page url
 * @returns {any}
 */

export const showInstallationInfo = (depCandidate, spinner, url) => {
  const msg = ` You need to download ${depCandidate} from the official downloads page: ${url}`;
  if (typeof spinner === 'undefined') {
    console.log(chalk.cyan.bold(msg));
  } else {
    spinner.info(msg);
  }
  process.exit(1);
};

/**
 * Warns appropriately if the project name is invalid
 *
 * @param {String} projectName - Name of the project
 * @returns {Void}
 */

export const invalidProjectName = projectName => {
  console.log(
    chalk.red.bold(
      ` Error: Could not create a project called ${chalk.red(
        `"${chalk.cyan.bold(projectName)}"`,
      )} because of npm naming restrictions:`,
    ),
  );
  process.exit(1);
};

/**
 * Warns appropriately if the respective directory exists in path
 *
 * @param {String} projectName - Name of the project
 * @returns {any}
 */

export const directoryExistsInPath = projectName => {
  console.log(
    chalk.red.bold(
      `\n Error: Directory ${chalk.cyan.bold(
        projectName,
      )} already exists in path!`,
    ),
  );
  process.exit(1);
};

/**
 * Warns the user appropriately if multiple arguments were provided for the project name
 *
 * @returns {Void}
 */

export const hasStrayArgs = () => {
  console.log(
    chalk.red.bold(
      '\n Error: Kindly provide only one argument as the directory name!!',
    ),
  );
  process.exit(1);
};
