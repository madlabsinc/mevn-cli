'use strict';

const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const chalk = require('chalk');
const createFile = require('../../utils/createFile');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

let controllersFile = fs.readFileSync(__dirname + '/../../templates/controllers/user_controller.js', 'utf8');

exports.generateController = () => {
  showBanner();
  configFileExists();

  setTimeout(() => {
    shell.cd('server/controllers');

    let removeCmd = os.type() === 'Windows_NT' ? 'del' : 'rm';
    if (fs.existsSync('./default.js')) {
      shell.exec(`${removeCmd} default.js`);
    }

    createFile('./user_controller.js', controllersFile, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  }, 200);
};
