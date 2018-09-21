const fs = require('fs');
const shell = require('shelljs');
const os = require('os');

let controllersfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('controllers');

  fs.writeFile('./default.js ', '', (err) => {
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow('File created...!'));
    }
  })

}

exports.controllersfunction = controllersfunction;