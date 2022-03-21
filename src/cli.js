#!/usr/bin/env node

'use strict';

// Require Modules.
import '@babel/polyfill';
import chalk from 'chalk';
import envinfo from 'envinfo';
import leven from 'leven';
import program from 'commander';
import updateNotifier from 'update-notifier';

// Defining action handlers for respective commands.
import add from './commands/add';
import codesplit from './commands/codesplit';
import deploy from './commands/deploy/';
import dockerize from './commands/dockerize';
import generate from './commands/generate';
import init from './commands/init';
import serve from './commands/serve';

import * as logger from './utils/logger';
import pkg from '../package';

updateNotifier({ pkg }).notify();

// Suggest matching commands
const suggestCommands = (cmd) => {
  const availableCommands = program.commands.map((c) => c._name);

  const suggestion = availableCommands.find(
    (c) => leven(c, cmd) < c.length * 0.4,
  );
  if (suggestion) {
    logger.error(` Did you mean ${chalk.yellow(suggestion)}?`);
  }
};

// Defining all the available commands.
program.version(pkg.version).usage('<command> [options]');

program
  .command('init <appname>')
  .description('Scaffolds a MEVN stack project in the current path')
  .action(init);

program
  .command('codesplit')
  .description('Lazy load components as required')
  .action(codesplit);

program
  .command('generate')
  .description(
    'Generates client side component files and server side CRUD boilerplate template',
  )
  .action(generate);

program
  .command('add [deps...]')
  .option('-d, --dev', 'install dev-dependencies')
  .description('Install dependencies on the go')
  .action(add);

program
  .command('serve')
  .description('Serves client/server locally')
  .action(serve);

program
  .command('dockerize')
  .description('Serves the webapp as mult-container Docker applications')
  .action(dockerize);

program
  .command('deploy')
  .description('Deploys the webapp to a cloud solution of choice')
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

// Validation for unknown commands
program.on('command:*', ([cmd]) => {
  program.outputHelp();
  logger.error(`\n Unknown command ${chalk.yellow(cmd)}.\n`);
  suggestCommands(cmd);
  process.exitCode = 1;
});

program.parse(process.argv);

// Shows up help if no arguments were provided.
if (!program.args.length) {
  program.help();
}
