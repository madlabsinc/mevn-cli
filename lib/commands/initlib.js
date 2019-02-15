'use strict';

const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const inquirer = require('inquirer');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const os = require('os');
const Table = require('cli-table');
const validate  = require('validate-npm-package-name');
const showBanner = require('../external/banner');
const boilerplate = require('../../config.json');

let serverCommands = new Table();
let generalCommands = new Table();

let frame = elegantSpinner();

let projectName;

let showTables = () => {

  console.log(chalk.yellow('server commands:-'));

  serverCommands.push({
    'mevn-cli create:model': 'To create models file'
  }, {
    'mevn-cli create:route' : 'To create routes file'
  }, {
    'mevn-cli create:controller': 'To create controllers file'
  }, {
    'mevn-cli create:component': 'To create components file'
  },{
    'mevn-cli add:package': 'To add a package to the project'
  }, {
    'mevn-cli create:config': 'To create config file'
  });
  console.log(serverCommands.toString());

  console.log(chalk.yellow('\ncommands to run:-'));

  generalCommands.push({
    'mevn-cli version': 'Shows the current version and additional info'
  }, {
    'mevn-cli run:server': 'To run server'
  }, {
    'mevn-cli run:client': 'To run client'
  }, {
    'mevn-cli add:package': 'To add additional packages as required'
  }, {
    'mevn-cli create:component <component_name>': 'To create new components as required'
  }, {
    'mevn-cli codesplit <component_name>': 'To lazy load components as required'
  }, {
    'mevn-cli create:git-repo': 'To create a GitHub repository and fire the first commit'
  }, {
    'mevn-cli dockerize': 'To run the client and server in separate docker containers'
  }, {
    'mevn-cli deploy': 'To deploy the app to Heroku'
  });
  console.log(generalCommands.toString());

  console.log(chalk.redBright('\n\nwarning:'));
  console.log('Do not delete mevn.json file');

};

let fetchTemplate = (template) => {
  let templateDir = 'mevn-boilerplate';
  if (template !== 'basic') {
    templateDir = `mevn-${template}-boilerplate`;
  }
  shell.exec(boilerplate[template], {silent: true}, {async: true});

  let fetchSpinner = setInterval(() => {
    logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
  }, 50);

  setTimeout(() =>{

    console.log('\n');
    clearInterval(fetchSpinner);
    logUpdate.clear();
    showTables();

  }, 5000);

  if (os.type() === 'Linux'){
    shell.exec(`mv ${templateDir} ` + projectName);
  } else if (os.type() === 'Windows_NT'){
    shell.exec(`ren ${templateDir} ` + projectName);
  } else if (os.type() === 'darwin'){
    shell.exec(`mv ${templateDir} ` + projectName);
  }

  if (template === 'nuxt') {
    setTimeout(() =>{

      console.log('\n');

      inquirer.prompt([{
        name: 'mode',
        type: 'list',
        message: 'Choose your preferred mode',
        choices: ['Universal', 'SPA']
      }])
      .then((choice) => {
        if (choice.mode === 'Universal') {

          let configFile = fs.readFileSync(`./${projectName}/nuxt.config.js`, 'utf8').toString().split('\n');

          let index = configFile.indexOf(configFile.find(line => line.includes('mode')));
          configFile[index] = ` mode: 'universal',`;

        fs.writeFileSync(`./${projectName}/nuxt.config.js`, configFile.join('\n'));
        }
        showTables();
      });


    }, 5000);
  }
}

let initfn = (appName) => {

  showBanner();
  console.log('\n');

  let initialSpinner = setInterval(() => {
    logUpdate('Initializing ' + chalk.cyan.bold.dim(frame()));
  }, 50);

  setTimeout(() => {
    const hasMultipleProjectNameArgs = process.argv[4] && !process.argv[4].startsWith('-');
    // Validation for multiple directory names
    if (hasMultipleProjectNameArgs){
      console.log(chalk.red.bold('\n Kindly provide only one argument as the directory name!!'));
      process.exit(1);
    }

  const validationResult = validate(appName);
	if (!validationResult.validForNewPackages) {
    	  console.error(
      		`Could not create a project called ${chalk.red(
        	`"${appName}"`
    		)} because of npm naming restrictions:`
    	  );
    	process.exit(1);
	}

	if (fs.existsSync(appName)) {
	  console.error(chalk.red.bold(`\n Directory ${appName} already exists in path!`));
      process.exit(1);
	}

	if (fs.existsSync('./mevn.json')) {
	  console.log(`${chalk.yellow.bold(`\n mevn.json file already exists in path!`)}`);
      process.exit(1);
	}

    clearInterval(initialSpinner);
    logUpdate.clear();
    projectName = appName;

    inquirer.prompt([{
      name: 'template',
      type: 'list',
      message: 'Please select one',
      choices: ['basic', 'pwa', 'graphql', 'Nuxt-js']

    }])
    .then((choice) => {

      fs.writeFile('./mevn.json', '{\n  \"project_name\": \"' +  appName + '\"\n}', (err) => {
        if (err) {
          throw err;
        }
      });
      if (choice.template === 'Nuxt-js') {
        choice.template = 'nuxt';
      }
      fetchTemplate(choice.template);
    });
  }, 1000);

};

module.exports = initfn;
