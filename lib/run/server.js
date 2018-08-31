const fs = require('fs')
const shell = require('shelljs')
const cmd = require('node-cmd')
const Spinner = require('cli-spinner').Spinner
const process = require('process')

const heading = require('../external/figlet')

let serverfunction = () => {

  heading.figletfunction()
  var data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')

  var obj = new Spinner('%s')
  
  setTimeout(() => {
    obj.start() 
  }, 50) 

  cmd.get('npm install', (err, data, stderr) => {
    obj.stop()
    console.log(data)
    setTimeout(() => {
      shell.exec('npm start')
    }, 200)
    
  })
}

exports.serverfunction = serverfunction