#!/usr/bin/env node

'use strict';

// Require Modules
const program = require('commander');
const chalk = require('chalk');

// Initialize Command variables
const { versionInfo } = require('../lib/commands/basic/version');
const { initializeProject } = require('../lib/commands/basic/init');
const { generateFile } = require('../lib/commands/basic/generate');
const { createComponent } = require('../lib/commands/basic/component');
const { asyncRender } = require('../lib/commands/basic/codesplit');
const { addPackage } = require('../lib/commands/basic/package');
const { setupProject } = require('../lib/commands/serve/setup');
const { dockerize } = require('../lib/commands/deploy/docker');
const { createRepo } = require('../lib/commands/deploy/gitRepo');
const { deploy } = require('../lib/commands/deploy/herokuDeploy');
const { configureCommand } = require('../lib/commands/configure/configureCommand');
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
  .command('create:component <componentname>')
  .description('To create component-file')
  .action(createComponent);

program
  .command('codesplit <componentname>')
  .description('To code split the required component')
  .action(asyncRender);

program
  .command('generate')
  .description('To generate model, route, controller and DB config files')
  .action(generateFile);

program
  .command('add:package')
  .description('To add a new package to the project')
  .action(addPackage);

program
  .command('serve')
  .description('To serve client/server')
  .action(setupProject);

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
  .command('configure')
  .description('to change package manager, test runners and migrating to webpack4')
  .action(configureCommand);

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
