'use strict';

const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

exports.showBanner = () => {
  clear();
  figlet('Mevn-cli', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.redBright(data));
    console.log(chalk.yellow('Tool for mevn stack.'));
  });

};
