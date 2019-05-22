'use strict';

import chalk from 'chalk';
import fs from 'fs';

exports.checkIfConfigFileExists = () => {
  if (!fs.existsSync('./mevn.json')) {
    console.log(
      chalk.cyan.bold(`\n\n Make sure that you're within a valid MEVN project
      \n${chalk.red.bold(' Error:')} No mevn.json file found
    `),
    );
    process.exit(1);
  }
};

exports.templateIsGraphQL = () => {
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

exports.dependencyNotInstalled = dependency => {
  console.log(
    chalk.red.bold(`Warning:- ${chalk.cyan.bold(
      `${dependency} is required to be installed`,
    )}
    `),
  );
  process.exit(1);
};

exports.showInstallationInfo = (depCandidate, spinner, url) => {
  const msg = `You need to download ${depCandidate} from the official downloads page: ${url}`;
  typeof spinner !== 'undefined'
    ? spinner.info(msg)
    : console.log(chalk.cyan.bold(msg));
  process.exit(1);
};
