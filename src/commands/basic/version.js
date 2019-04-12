'use strict';

import chalk from 'chalk';

import { version } from '../../../package.json';
import { showBanner } from '../../external/banner';

exports.versionInfo = () => {
  showBanner();
  setTimeout(() => {
    console.log(chalk.greenBright(`\n\n  MEVN-CLI: ${version}`));
    console.log(
      chalk.greenBright(
        `\n  Node: ${require('child_process').execSync('node -v')}`,
      ),
    );
    console.log(chalk.greenBright(`  OS: ${process.platform}`));
  }, 100);
};
