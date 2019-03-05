'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
const os = require('os');

const { appData } = require('../../utils/projectConfig');
const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

const executeCommands = async (templateIsNuxt) => {
  let serverPath = templateIsNuxt ? `/${process.cwd()}/server` : '../server';
  let moveCmd = os.type() === 'Windows_NT' ? 'move' : 'mv';

  if (!templateIsNuxt) {
      shell.cd('client');
  }

  const buildCommands = [
    'npm install',
    'npm run build',
    `${moveCmd} /${process.cwd()}/dist ${serverPath}`,
    `sudo docker login --username=_ --password=$(heroku auth:token) registry.heroku.com`,
  ];
    await Promise.all(buildCommands.map(cmd => {
      shell.exec(cmd, {silent: true});
    }))
    .catch((err) => {
      throw err;
    })
    shell.echo('\n Creating a heroku app');
    await shell.exec('heroku create');

    inquirer.prompt([{
      name: 'appName',
      type: 'input',
      message: 'Please enter the name of heroku app(url)',
    }])
    .then(async (userInput) => {
      try {
        await shell.exec(`sudo heroku container:push web -a ${userInput.appName}`);
        await shell.exec(`sudo heroku container:release web -a ${userInput.appName}`);
        await shell.exec(`heroku open -a ${appName}`);
     } catch (err) {
       throw err;
     }
    });
};

exports.deploy = () => {
  showBanner();

  setTimeout(() => {
    configFileExists();

    appData()
    .then( async(data) => {
      //check and install heroku-cli
      if (!shell.which('heroku')) {
        shell.echo('Heroku in not installed on your system');
        if (process.platform === 'win32') {
          try{
            await shell.echo('Installing heroku for Windows...');
            await hell.echo('You need to manually download heroku-cli from: https://devcenter.heroku.com/articles/heroku-cli and try to deploy again');
            await shell.exit(1);
          } 
          catch (err) {
            throw err;
          }
        }

        else if (process.platform === 'darwin') {
          try{
            await shell.echo('Installing heroku for Mac...')
            await shell.exec('brew tap heroku/brew && brew install heroku', {silent: true});
            await executeCommands(data.template === 'Nuxt-js');
          } 
          catch (err) {
            throw err;
          }
        }

        else if (process.platform === 'linux') {
          try{
            await shell.echo('Installing heroku for Linux...');
            await shell.exec('sudo apt get update', {silent: true});
            await shell.exec('sudo apt-get install snap', {silent: true});
            await shell.exec('sudo snap install --classic heroku', {silent: true});
            await shell.echo('Heroku was installed successfully');
            await executeCommands(data.template === 'Nuxt-js');
          }
          catch (err) {
            throw err;
          }
        }
      }
      else {
        shell.echo('Heroku is installed in your system, proceeding further with deploy...');
        executeCommands(data.template === 'Nuxt-js');
      }
    });
  }, 100);

};
