const fs = require('fs')
const shell = require('shelljs')
const cmd = require('node-cmd')
const Spinner = require('cli-spinner').Spinner
const elegantSpinner = require('elegant-spinner')
const logUpdate = require('log-update')
const chalk = require('chalk')
const process = require('process')

const heading = require('../external/figlet')

let serverfunction = () => {

  heading.figletfunction()
  let data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8')
  let appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')

  let frame = elegantSpinner()
  // let obj = new Spinner('%s')
  let runSpinner = setInterval(() => {
    logUpdate(chalk.green.bold('Installing dependencies in the background. Hold on... ') + chalk.cyan.bold.dim(frame()));
    }, 50)
  
  /* setTimeout(() => {
    obj.start() 
  }, 100) */ 

  cmd.get('npm install', (err, data, stderr) => {
    // obj.stop()
    clearInterval(runSpinner)
    logUpdate.clear()
    console.log(data)
    setTimeout(() => {
      shell.exec('npm start')
    }, 200)
    
  })
}

exports.serverfunction = serverfunction