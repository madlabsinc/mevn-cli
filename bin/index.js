#!/usr/bin/env node

'use strict';

// Require Modules
const program = require('commander');
const chalk = require('chalk');

// Initialize Command variables
const { versionInfo } = require('../lib/commands/basic/version');
const { initializeProject } = require('../lib/commands/basic/init');
const { generateModel } = require('../lib/commands/basic/createModel');
const { generateController } = require('../lib/commands/basic/createController');
const { createComponent } = require('../lib/commands/basic/component');
const { asyncRender } = require('../lib/commands/basic/codesplit');
const { addPackage } = require('../lib/commands/basic/package');
const { generateRoute } = require('../lib/commands/basic/createRoute');
const { generateConfig } = require('../lib/commands/basic/createConfig');
const { setupServer } = require('../lib/commands/serve/server');
const { setupClient } = require('../lib/commands/serve/client');
const { dockerize } = require('../lib/commands/deploy/docker');
const { createRepo } = require('../lib/commands/deploy/gitRepo');
const { deploy } = require('../lib/commands/deploy/herokuDeploy');

// Define Commands in CLI TOOL

program
  .command('version')
  .description('Outputs version along with local development environment information')
  .action(versionInfo);

program
  .command('init <appname>')
  .description('To init the project')
  .action(initializeProject);

program
  .command('create:controller')
  .description('To create controllers-file')
  .action(generateController);

program
  .command('create:component <componentname>')
  .description('To create component-file')
  .action(createComponent);

program
  .command('codesplit <componentname>')
  .description('To code split the required component')
  .action(asyncRender);

program
  .command('create:route')
  .description('To create router-file')
  .action(generateRoute);

program
  .command('create:config')
  .description('To create configuration file for database')
  .action(generateConfig);

program
  .command('create:model')
  .description('To create models-file')
  .action(generateModel);

program
  .command('add:package')
  .description('To add a new package to the project')
  .action(addPackage);

program
  .command('run:client')
  .description('To run client')
  .action(setupClient);

program
  .command('run:server')
  .description('To run server')
  .action(setupServer);

program
  .command('dockerize')
  .description('To dockerize the app')
  .action(dockerize);

program
  .command('deploy')
  .description('To deploy the app to Heroku')
  .action(deploy);

program
  .command('create:git-repo')
  .description('To create a GitHub repository and fire the first commit')
  .action(createRepo);

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp();
    console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
});

program.parse(process.argv);

// Shows help if just mevn-cli is fired in

if(!program.args.length){
  program.help();
}
