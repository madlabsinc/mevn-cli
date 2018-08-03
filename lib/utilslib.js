const fs = require('fs')

let utilsfunction = (filename) => {
  shell.cd('mevn')
  var appname = shell.ls()
  shell.cd(appname)
  shell.cd('server')
  shell.cd('utils')
}

exports.utilsfunction = utilsfunction