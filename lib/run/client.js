const fs = require('fs')
const shell = require('shelljs')
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

  obj.start() 

  shell.exec('npm install', {silent: true},() => {
    console.log('\n')
    obj.stop()
    shell.exec('npm run dev')
  })

}

exports.clientfunction = clientfunction