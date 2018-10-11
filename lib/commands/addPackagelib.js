const fs = require('fs');
const shell = require('shelljs');
const cmd = require('node-cmd');
const inquirer = require('inquirer');
const chalk = require('chalk');

let addPackagefn = () => {
    let questions = [
        {
            type: 'list',
            name: 'packages',
            message: 'Which package do you want to install?',
            choices: ['vee-validate', 'axios']
        }
    ]

    let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);
    shell.cd('client');

    inquirer.prompt(questions)
        .then(answers => {
            if (answers.packages == 'vee-validate') {
                cmd.get('npm install vee-validate --save-dev', (err) => {
                    if(err){
                        console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
                        exit(1);
                      }
            
                    console.log(chalk.green.bold('Package added successfully'));
                })
            }

            if (answers.packages == 'axios') {
                cmd.get('npm install axios --save', (err) => {
                    if(err){
                        console.log(chalk.red.bold('Something went wrong. Couldn\'t install the required packages!'));
                        exit(1);
                      }
            
                    console.log(chalk.green.bold('Package added successfully'));
                })
            }
        })
}

module.exports = addPackagefn;