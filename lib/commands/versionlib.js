'use strict';

const chalk = require('chalk');

const showBanner = require('../external/banner');
const version = require('../../package.json').version;
let versionfn = () => {
    showBanner();
    setTimeout(() => {
     console.log(chalk.greenBright(`\n\n  MEVN-CLI: ${version}`));
     console.log(chalk.greenBright(`\n  Node: ${require('child_process').execSync('node -v')}`));
     console.log(chalk.greenBright(`  OS: ${process.platform}`));
    }, 100);
};

module.exports = versionfn;