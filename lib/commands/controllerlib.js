const fs = require('fs')
const shell = require('shelljs')

let controllerfunction = (filename) => {

  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('controller')

  if (os.type == 'Linux') {
    shell.exec('rm default.js')
  } else if (os.type == 'win32') {
    shell.exec('del default.js')
  } else {
    shell.exec('rm default.js')
  }

  fs.writeFile('./ ' + filename, '', (err) => {
    if (err) {
      throw err;
    } else {
      console.log('File created...!')
    }
  })

}

exports.controllerfunction = controllerfunction