const fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const inquirer = require('inquirer')
const chalk = require('chalk')

let configfunction = (filename) => {

  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('config')

  if (os.type == 'Linux') {
    shell.exec('rm config.js')
  } else if (os.type == 'win32') {
    shell.exec('del config.js')
  } else {
    shell.exec('rm config.js')
  }

  inquirer.prompt([{
    name: 'db',
    type: 'input',
    message: 'Enter the url for the database : '
  }]).then((answers) => {

    fs.writeFile('./ ' + filename, 'module.exports = {\n  \'url\': "' + answers.db + '"\n}', (err) => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.yellow('File created...!'))
      }
    })
  
  })

}

exports.configfunction = configfunction