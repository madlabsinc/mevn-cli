'use strict';

const chalk = require('chalk');

const { showBanner } = require('../external/banner');
const cliVersion = require('../../package.json').version;

exports.versionInfo = () => {
    showBanner();
    setTimeout(() => {
     console.log(chalk.greenBright(`\n\n  MEVN-CLI: ${cliVersion}`));
     console.log(chalk.greenBright(`\n  Node: ${require('child_process').execSync('node -v')}`));
     console.log(chalk.greenBright(`  OS: ${process.platform}`));
    }, 100);
};
