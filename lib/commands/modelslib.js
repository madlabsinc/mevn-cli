const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const os = require('os');

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

	if(os.type() === 'Linux' || os.type() === 'darwin'){
	 shell.exec('rm default.js');
  } else{
	shell.exec('del default.js');
  }

    fs.writeFile('./index.js', userSchema, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.yellow('File created...!'));
      }
    })
  })


}

exports.modelsfunction = modelsfunction;
