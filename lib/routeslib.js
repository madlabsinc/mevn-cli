const fs = require('fs')
const shell = require('shelljs')

let routesfunction = (filename) => {

  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('routes')

  if (os.type == 'Linux') {
    shell.exec('rm default.js')
  } else if (os.type == 'win32') {
    shell.exec('del default.js')
  } else {
    shell.exec('rm default.js')
  }

  fs.writeFile('./' + filename, 'const express = require(\'express\')\nconst Person = require(\'../models/person\')\n\nvar app = express()\n\napp.get(\'/person\', (req, res, next) => {\n  res.send({name: \'GET\'})\n})\n\napp.post(\'/person\', (req, res,next) => {\n  res.send({name: \'POST\'})\n})\n\napp.put(\'/person/:id\', (req, res, next) => {\n  res.send({name: \'PUT\'})\n})\n\napp.delete(\'/person/:id\', (req, res, next) => {\n  res.send({name: \'DELETE\'})\n})\n\nmodule.exports = router', function (err) {
    if (err) {
      throw err;
    } else {
      console.log('File created...!')
    }

  })
}

exports.routesfunction = routesfunction