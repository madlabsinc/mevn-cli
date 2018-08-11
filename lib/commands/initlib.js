const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')
const Spinner = require('cli-spinner').Spinner
const os = require('os')

const heading = require('../external/figlet')

let initfunction = (dir) => {

  heading.figletfunction()
  var obj = new Spinner('%s')
  obj.start()

  setTimeout(() => {

    obj.stop()
    console.log('\n')

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
        shell.exec("git clone https://github.com/MadlabsInc/mevn-boilerplate.git", {silent: true}, {async: true})
        var spin = new Spinner('%s')
        spin.start()
        setTimeout(() =>{
          console.log('\n')
          spin.stop()
        }, 5000)

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