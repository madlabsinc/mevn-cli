const fs = require('fs')
const shell = require('shelljs')
const os = require('os')

let modelsfunction = (filename) => {

  var data = fs.readFileSync('./mevn.json', 'utf8')
  var appname = JSON.parse(data)
  shell.cd(appname.project_name)
  shell.cd('server')
  shell.cd('models')

  if (os.type == 'Linux') {
    shell.exec('rm default.js')
  } else if (os.type == 'win32') {
    shell.exec('del default.js')
  } else {
    shell.exec('rm default.js')
  }


  fs.writeFile('./ ' + filename, 'const mongoose = require(\'mongoose\')\nconst Schema = mongoose.Schema\nconst userschema = new Schema({\n  name: {\n    type: String,\nrequired: [true, \'Name is reequiered\']\n  }\n})\n\nconst user = mongoose.model(\'usermodel\', userschema)\nmodule.exports = user', (err) => {
    if (err) {
      throw err;
    } else {
      console.log('File created...!')
    }
  })
}

exports.modelsfunction = modelsfunction