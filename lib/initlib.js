const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')
const elegantspinner = require('elegant-spinner')
const logupdate = require('log-update')
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
      choices: ['pwa', 'simple']
    }]).then((answers) => {

      if (answers.initial + '' == 'simple') {
        shell.exec('git clone https://github.com/MadlabsInc/mevn-boilerplate.git')
        shell.exec('mv mevn-boilerplate ' + dir)
      } else {
        console.log('on development')
      }

    })
  }, 1000)

}

exports.initfunction = initfunction