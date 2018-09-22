const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

let userSchema = fs.readFileSync(__dirname + '/files/models/user_schema.js', 'utf8');

let modelsfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('models');
  
  inquirer.prompt([{
    name: 'schemaName',
    type: 'input',
    message: 'Enter the name for the database model:-'
  }]).then((answers) => {

    fs.writeFile('./index.js ', userSchema, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.yellow('File created...!'));
      }
    })
  })


}

exports.modelsfunction = modelsfunction;
