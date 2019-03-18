'use strict';

const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const inquirer = require('inquirer');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const Table = require('cli-table3');
const validate  = require('validate-npm-package-name');
const { showBanner } = require('../../external/banner');
const boilerplate = require('../../../config.json');

let availableCommands = new Table();
let frame = elegantSpinner();

let projectName;
let projectConfig;

let showTables = () => {
  console.log(chalk.yellow('\n Available commands:-'));

  availableCommands.push({
    'mevn version': 'Current CLI version'
  }, {
    'mevn serve': 'To launch client/server'
  }, {
    'mevn add:package': 'Add additional packages'
  },{
    'mevn generate': 'To generate config files'
  }, {
    'mevn create:component <name>': 'Create new components'
  }, {
    'mevn codesplit <name>': 'Lazy load components'
  }, {
    'mevn create:git-repo': 'Create a GitHub Repo'
  }, {
    'mevn dockerize': 'Launch within docker containers'
  }, {
    'mevn deploy': 'Deploy the app to Heroku'
  });
  console.log(availableCommands.toString());

  console.log(chalk.cyanBright(`\n\n Make sure that you've done ${chalk.greenBright(`cd ${projectName}`)}`));
  console.log(chalk.redBright('\n warning:'));
  console.log(' Do not delete mevn.json file');
};

let fetchTemplate = (template) => {
  let templateDir = 'mevn-boilerplate';
  if (template !== 'basic') {
    templateDir = `mevn-${template}-boilerplate`;
  }
  shell.exec(`${boilerplate[template]} ${projectName}`, {silent: true}, {async: true});

  let fetchSpinner = setInterval(() => {
    logUpdate('Fetching the boilerplate ' + chalk.cyan.bold.dim(frame()));
  }, 50);

  setTimeout(() =>{
    console.log('\n');
    clearInterval(fetchSpinner);
    logUpdate.clear();
    showTables();

  }, 5000);

  fs.writeFileSync(`./${projectName}/mevn.json`, projectConfig.join('\n').toString());

  if (template === 'nuxt') {
    setTimeout(async () => {
        console.log('\n');
        //add pwa support
        await inquirer.prompt([{
          name: 'pwa',
          type: 'confirm',
          message: 'Do you want to have pwa support?'
        }])
        .then( async(answers) => {
          if (answers.pwa) {
            try{
              //add pwa support
              await shell.cd(`${projectName}`);
              await shell.echo('Configuring your application to enable pwa support...');
              // entry of config in mevn.json
              let pwaConfig = JSON.parse(fs.readFileSync('mevn.json').toString());
              pwaConfig["dependencies"] = [{"modules":"@nuxtjs/pwa"}];
              await fs.writeFileSync('./mevn.json', JSON.stringify(pwaConfig));
              //add pwa support module in nuxt.config.js 
              let configFile = fs.readFileSync(`./nuxt.config.js`, 'utf8').toString().split('\n');
              let index = configFile.indexOf(configFile.find(line => line.includes('modules: [')));
              configFile[index] = ` modules: ['@nuxtjs/pwa',`;
              await fs.writeFileSync('./nuxt.config.js', configFile.join('\n'));
              //create sw.* and place it in gitignore
              await shell.exec('touch sw.*');
            } catch (err) {
              throw err;
            }
          }
          else{
            await shell.echo('Okay, proceeding further..');
          }
        })
        .then(async () => {
            //prompt user for Universal/SPA choices
            await inquirer.prompt([{
              name: 'mode',
              type: 'list',
              message: 'Choose your preferred mode',
              choices: ['Universal', 'SPA']
              }]).then((choice) => {
                if (choice.mode === 'Universal') {
                  let configFile = fs.readFileSync(`./nuxt.config.js`, 'utf8').toString().split('\n');
                  let index = configFile.indexOf(configFile.find(line => line.includes('mode')));
                  configFile[index] = ` mode: 'universal',`;
                  fs.writeFileSync(`./nuxt.config.js`, configFile.join('\n'));
              }
              showTables();
            });
        })
    }, 5000);
  }
};

exports.initializeProject = (appName) => {
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
      projectConfig = [
        '{',
        `"name": "${appName}",`,
        `"template": "${choice.template}"`,
        '}'
      ];

      if (choice.template === 'Nuxt-js') {
        choice.template = 'nuxt';
      }
      fetchTemplate(choice.template);
    });
  }, 1000);

};
