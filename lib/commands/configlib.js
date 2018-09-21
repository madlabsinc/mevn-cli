const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');

let configfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('config');

  inquirer.prompt([{
    name: 'db',
    type: 'input',
    message: 'Enter the url for the database : '
  }]).then((answers) => {

    fs.writeFile('./config.js ', 'module.exports = {\n  \'url\': "' + answers.db + '"\n}', (err) => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.yellow('File created...!'));
      }
    })
  
  });

}

exports.configfunction = configfunction;