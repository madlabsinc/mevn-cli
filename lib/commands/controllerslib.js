const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const chalk = require('chalk')

let controllersFile = fs.readFileSync(__dirname + '/files/controllers/user_controller.js', 'utf8');

let controllersfunction = () => {

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  shell.cd('server');
  shell.cd('controllers');

  if(os.type() === 'Linux' || os.type() === 'darwin'){
	 shell.exec('rm default.js');
  } else{
	shell.exec('del default.js');
  }

  fs.writeFile('./index.js', controllersFile, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(chalk.yellow('File created...!'));
    }
  })

}

exports.controllersfunction = controllersfunction;
