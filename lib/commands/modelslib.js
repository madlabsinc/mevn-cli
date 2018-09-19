const fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const inquirer = require('inquirer')
const chalk = require('chalk')

let modelsfunction = (filename) => {

  let data = fs.readFileSync('./mevn.json', 'utf8')
  let appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('models')

  if (os.type == 'Linux') {
    shell.exec('rm default.js')
  } else if (os.type == 'win32') {
    shell.exec('del default.js')
  } else {
    shell.exec('rm default.js')
  }
  
  inquirer.prompt([{
    name: 'schemaname',
    type: 'input',
    message: 'Enter the name for the database model:-'
  }]).then((answers) => {

    fs.writeFile('./ ' + filename, 'const mongoose = require(\'mongoose\')\nconst Schema = mongoose.Schema\nconst userschema = new Schema({\n  name: {\n    type: String,\n    required: [true, \'Name is reequiered\']\n  }\n})\n\nconst user = mongoose.model(\'' + answers.schemaname + '\', userschema)\nmodule.exports = user', (err) => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.yellow('File created...!'))
      }
    })
  })


}

exports.modelsfunction = modelsfunction