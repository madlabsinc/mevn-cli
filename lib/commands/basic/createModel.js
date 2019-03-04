'use strict';

const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const os = require('os');
const createFile = require('../../utils/createFile');

const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

let userSchema = fs.readFileSync(__dirname + '/../../templates/models/user_schema.js', 'utf8');

exports.generateModel = () => {
  showBanner();
  configFileExists();

  setTimeout(() => {
    shell.cd('server/models');

    let removeCmd = os.type() === 'Windows_NT' ? 'del' : 'rm';
    if (fs.existsSync('./default.js')) {
      shell.exec(`${removeCmd} default.js`);
    }

    createFile('./user_schema.js', userSchema, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log(chalk.yellow('File Created...!'));
    });
  }, 200);
};
