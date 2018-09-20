const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

let figletfunction = () => {

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

}

exports.figletfunction = figletfunction;