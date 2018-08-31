const fs = require('fs')
const shell = require('shelljs')
const cmd = require('node-cmd')
const Spinner = require('cli-spinner').Spinner
const chalk = require('chalk')

const heading = require('../external/figlet')

let clientfunction = () => {

  heading.figletfunction()
  
  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('client')

  var obj = new Spinner('%s')

  setTimeout(() => {
    obj.start()
  }, 50)

  cmd.get('npm install', (err, data, stderr) => {
    obj.stop()
    console.log(data)
    setTimeout(() => {
      shell.exec('npm run dev')
    }, 200)
  })  

}

exports.clientfunction = clientfunction