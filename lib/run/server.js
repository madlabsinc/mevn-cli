const fs = require('fs')
const shell = require('shelljs')
const Spinner = require('cli-spinner').Spinner

const heading = require('../external/figlet')

let serverfunction = () => {

  heading.figletfunction()
  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')

  var obj = new Spinner('%s')

  obj.start() 

  shell.exec('npm install', {silent: true},() => {
    console.log('\n')
    obj.stop()
    // error 
    shell.exec('npm start')
  })
}

exports.serverfunction = serverfunction