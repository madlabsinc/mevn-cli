const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')
const Spinner = require('cli-spinner').Spinner
const os = require('os')
const process = require('process')
const Table = require('cli-table')
const heading = require('../external/figlet')

var table = new Table()
var tab = new Table()

let initfunction = (dir) => {

  heading.figletfunction()
  var obj = new Spinner('%s')
  setTimeout(() => {
    obj.start()
  }, 100)
  

  setTimeout(() => {

    obj.stop()
    console.log('\n')

    inquirer.prompt([{
      name: 'initial',
      type: 'list',
      message: 'Please select one',
      choices: ['pwa', 'basic']
    }]).then((answers) => {
      // home alan one more
      fs.writeFile(os.homedir() + '/mevn.json', '{\n  \"project_name\": \"' + process.cwd() + '/' +  dir + '\"\n}', (err) => {
        if (err) {
          throw err;
        }
      })
    
      fs.writeFile('./mevn.json', '{\n  \"project_name\": \"' +  dir + '\"\n}', (err) => {
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
          console.log(chalk.yellow('server commands:-'))
          table.push({
            'mevn-cli models <filename>': 'To create models file'  
          }, {
            'mevn-cli routes <filename>' : 'To create routes file'
          }, {
            'mevn-cli controllers <filename>': 'To create controllers file'
          }, {
            'mevn-cli config <filename>': 'To create config file'
          })
          console.log(table.toString())

          console.log(chalk.yellow('\ncommands to run:-'))
          tab.push({
            'mevn-cli server': 'To run server'
          }, {
            'mevn-cli client': 'To run client'
          }, {
            'mevn-cli run': 'To run client and server at the same time'
          })
          console.log(tab.toString())

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