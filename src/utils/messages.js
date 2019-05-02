'use strict';

import chalk from 'chalk';
import fs from 'fs';

exports.checkIfConfigFileExists = () => {
  if (!fs.existsSync('./mevn.json')) {
    console.log(
      chalk.cyanBright(`\n\n Make sure that you're within a valid MEVN project
      \n${chalk.redBright('Error:')} No mevn.json file found
    `),
    );
    process.exit(1);
  }
};

exports.templateIsGraphQL = () => {
  let msg = `GraphQL boilerplate doesn't include ${chalk.yellowBright(
    `model, route and controller`,
  )} directories!`;
  console.log(
    chalk.redBright(
      `\n Warning:- ${chalk.cyanBright(`${msg}
    `)}`,
    ),
  );
  process.exit(1);
};

exports.dependencyNotInstalled = dependency => {
  console.log(
    chalk.redBright(`Warning:- ${chalk.cyanBright(
      `${dependency} is required to be installed`,
    )}
    `),
  );
  process.exit(1);
};

exports.showInstallationInfo = (spinner, url) => {
  const msg = `You need to download Git from the official downloads page: ${url}`;
  typeof spinner !== 'undefined'
    ? spinner.info(msg)
    : console.log(chalk.cyanBright(msg));
};
