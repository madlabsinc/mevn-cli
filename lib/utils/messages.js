'use strict';

const chalk = require('chalk');
const fs = require('fs');

exports.configFileExists = () => {
  if (!fs.existsSync('./mevn.json')) {
    console.log(chalk.cyanBright(`\n\n Make sure that you're within a valid MEVN project
      \n${chalk.redBright('Error:')} No mevn.json file found
    `));
    process.exit(1);
    }
};

exports.templateIsGraphQL = () => {
  let msg = `GraphQL boilerplate doesn't include ${chalk.yellowBright(`model, route and controller`)} directories!`;
  console.log(chalk.redBright(`\n Warning:- ${chalk.cyanBright(`${msg}
    `)}`
  ));
  process.exit(1);
};
