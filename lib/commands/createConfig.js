'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createFile = require('../utils/createFile');

const { showBanner } = require('../external/banner');
const { configFileExists } = require('../utils/messages');

exports.generateConfig = () => {
  showBanner();
  configFileExists();

  setTimeout(() => {
    shell.cd('server/config');

    inquirer.prompt([{
      name: 'db',
      type: 'input',
      message: 'Enter the url for the database : ',
    }]).then((answer) => {

      const configFileContent = [
        '{',
        `  "url": "${answer.db}"`,
        '}'
      ];

      createFile('./config.js', configFileContent.join('\n').toString(), { flag: 'wx' }, (err) => {
        if (err) throw err;
        console.log(chalk.yellow('File Created...!'));
      });
    });
  }, 200);
};
