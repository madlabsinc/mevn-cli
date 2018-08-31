const fs = require('fs')
const shell = require('shelljs')
const os = require('os')

let configfunction = (filename) => {

  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('config')

  if (os.type == 'Linux') {
    shell.exec('rm config.js')
  } else if (os.type == 'win32') {
    shell.exec('del config.js')
  } else {
    shell.exec('rm config.js')
  }

  fs.writeFile('./ ' + filename, '', (err) => {
    if (err) {
      throw err;
    } else {
      console.log('File created...!')
    }
  })

}

exports.configfunction = configfunction