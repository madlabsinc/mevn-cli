const fs = require('fs')

let servicesfunction = (filename) => {
  shell.cd('mevn')
  var appname = shell.ls()
  shell.cd(appname)
  shell.cd('server')
  shell.cd('services')
}

exports.servicesfunction = servicesfunction