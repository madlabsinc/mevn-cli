const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')
const elegantspinner = require('elegant-spinner')
const logupdate = require('log-update')
const os = require('os')
const heading = require('../external/figlet')

var frame = elegantspinner()

let initfunction = (dir) => {

  heading.figletfunction()
  var timerid = setInterval(function () {
    logupdate(frame());
  }, 50);

  setTimeout(() => {

    clearInterval(timerid)
    inquirer.prompt([{
      name: 'initial',
      type: 'list',
      message: 'Please select one',
      choices: ['pwa', 'basic']
    }]).then((answers) => {

      fs.writeFile('./mevn.json', '{\n  \"project_name\": \"' + dir + '\"\n}', (err) => {
        if (err) {
          throw err;
        }
      })

      if (answers.initial + '' == 'basic') {
        shell.exec("git clone https://github.com/MadlabsInc/mevn-boilerplate.git");

        if (os.type() + '' == 'Linux') {
          shell.exec('mv mevn-boilerplate ' + dir)
        } else if (os.type() + '' == 'win32') {
          shell.exec('rename mevn-boilerplate ' + dir)
        } else if (os.type() + '' == 'darwin') {
          shell.exec('mv mevn-boilerplate ' + dir)
        }

      } else {
        console.log('on development')
      }

    })
  }, 1000)

}

exports.initfunction = initfunction