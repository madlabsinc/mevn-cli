#!/usr/bin/env node

'use strict';

// Require Modules
import '@babel/polyfill';
import program from 'commander';
import chalk from 'chalk';

// Defining action handlers for respective commands
import { versionInfo } from './commands/basic/version';
import { initializeProject } from './commands/basic/init';
import { generateFile } from './commands/basic/generate';
import { createComponent } from './commands/basic/component';
import { asyncRender } from './commands/basic/codesplit';
import { addPackage } from './commands/basic/package';
import { setupProject } from './commands/serve/setup';
import { dockerize } from './commands/deploy/docker';
import { deploy } from './commands/deploy/herokuDeploy';

// Defining all the available commands
program
  .command('version')
  .description(
    'Outputs version along with local development environment information',
  )
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

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
});

program.parse(process.argv);

// Shows up help if no arguments were provided
if (!program.args.length) {
  program.help();
}
