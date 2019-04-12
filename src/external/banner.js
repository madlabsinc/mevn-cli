'use strict';

import clear from 'clear';
import figlet from 'figlet';
import chalk from 'chalk';

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
