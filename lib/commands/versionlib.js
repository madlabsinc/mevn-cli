const shell = require('shelljs');
const chalk = require('chalk');

const showBanner = require('../external/banner');
let versionfn = () => {
    showBanner();
    setTimeout(() => {
     console.log(chalk.greenBright('\n\n  MEVN-CLI: 1.0.0'));
     console.log(chalk.greenBright(`\n  Node: ${require('child_process').execSync('node -v')}`));
     console.log(chalk.greenBright(`  OS: ${process.platform}`));
    }, 100);
}

module.exports = versionfn;