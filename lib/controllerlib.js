const fs = require('fs')

let controllerfunction = (filename) => {
  shell.cd('mevn')
  var appname = shell.ls()
  shell.cd(appname)
  shell.cd('server')
  shell.cd('controller')
}

exports.controllerfunction = controllerfunction