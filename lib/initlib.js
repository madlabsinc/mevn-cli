const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

let initfunction = () => {

  clear()
  figlet('Mevn-cli', function (err, data) {
    if (err) {
      console.log('Something went wrong...S');
      console.dir(err);
      return;
    }
    console.log(chalk.redBright(data))
  });

}

exports.initfunction = initfunction