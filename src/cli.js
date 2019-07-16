#!/usr/bin/env node

'use strict';

// Require Modules.
import '@babel/polyfill';
import program from 'commander';
import chalk from 'chalk';
import didYouMean from 'didyoumean';
import envinfo from 'envinfo';
import updateNotifier from 'update-notifier';

// Setting edit distance to 60% of the input string's length.
didYouMean.threshold = 0.6;

// Defining action handlers for respective commands.
import initializeProject from './commands/basic/init';
import generateFile from './commands/basic/generate';
import asyncRender from './commands/basic/codesplit';
import addPlugin from './commands/basic/add';
import setupProject from './commands/serve/setup';
import dockerize from './commands/basic/docker';
import deploy from './commands/deploy/herokuDeploy';
import pkg from '../package';

updateNotifier({ pkg: pkg }).notify();

const suggestCommands = cmd => {
  const availableCommands = program.commands.map(c => c._name);

  const suggestion = didYouMean(cmd, availableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
};

// Defining all the available commands.
program.version(pkg.version).usage('<command> [options]');

program
  .command('init <appname>')
  .description('To init the project')
  .action(initializeProject);

program
  .command('codesplit')
  .description('To code split the required component')
  .action(asyncRender);

program
  .command('generate')
  .description('To generate model, route, controller and DB config files')
  .action(generateFile);

program
  .command('add')
  .description('To add a new plugin to the project')
  .action(addPlugin);

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
  .command('info')
  .description('Prints debugging information about the local environment')
  .action(() => {
    console.log(chalk.bold('\nEnvironment Info:'));
    envinfo
      .run({
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm'],
        Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
        npmGlobalPackages: ['mevn-cli'],
      })
      .then(console.log);
  });

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});

program.parse(process.argv);

// Shows up help if no arguments were provided.
if (!program.args.length) {
  program.help();
}
