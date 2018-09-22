const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');

let routesfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('routes');

  inquirer.prompt([{
    name: 'api',
    type: 'input',
    message: 'specify the api:-'
  }]).then((answers) => {

    fs.writeFile('./index.js', 'const express = require(\'express\')\nconst Usr = require(\'../models/default\')\n\nlet app = express()\n\napp.get(\'/' + answers.api + '\', (req, res, next) => {\n  res.send({name: \'GET\'})\n})\n\napp.post(\'/' + answers.api + '\', (req, res,next) => {\n  res.send({name: \'POST\'})\n})\n\napp.put(\'/' + answers.api + '/:id\', (req, res, next) => {\n  res.send({name: \'PUT\'})\n})\n\napp.delete(\'/' + answers.api + '/:id\', (req, res, next) => {\n  res.send({name: \'DELETE\'})\n})\n\nmodule.exports = app', (err) => {
      if (err) {
        throw err
      } else {
        console.log(chalk.yellow('File created...!'));
      }
  
    })
  })


}

exports.routesfunction = routesfunction;