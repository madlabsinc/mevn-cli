const fs = require('fs')

let modelsfunction = (filename) => {
  shell.cd('mevn')
  var appname = shell.ls()
  shell.cd(appname)
  shell.cd('server')
  shell.cd('models')

  fs.writeFile('./ ' + filename, 'const mongoose = require(\'mongoose\')\nconst Schema = mongoose.Schema\nconst userschema = new Schema({\n  name: {\n    type: String,\nrequired: [true, \'Name is reequiered\']\n  }\n})\n\nconst user = mongoose.model(\'usermodel\', userschema)\nmodule.exports = user', () => {
    if (err) {
      throw err;
    } else {
      console.log('File created...!')
    }
  })
}

exports.modelsfunction = modelsfunction