'use strict';

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { promisify } from 'util';

const printTitle = promisify(figlet);

exports.showBanner = async () => {
  clear();
  try {
    const data = await printTitle('Mevn CLI');
    console.log(chalk.redBright(data));
    console.log(chalk.yellow(' Light speed setup for MEVN stack based apps.'));
  } catch (err) {
    console.err(err);
    process.exit(1);
  }
};
