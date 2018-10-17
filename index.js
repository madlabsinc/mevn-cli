#!/usr/bin/env node

'use strict'

// Require Modules
const program = require('commander');

// Initialize Command variables
const initfn = require('./lib/commands/initlib');
const modelsfn = require('./lib/commands/modelslib');
const controllersfn = require('./lib/commands/controllerslib');
const componentsfn = require('./lib/commands/componentslib');
const addPackagefn = require('./lib/commands/addPackagelib');
const routesfn = require('./lib/commands/routeslib');
const configfn = require('./lib/commands/configlib');
const serverfn = require('./lib/run/server');
const clientfn = require('./lib/run/client');
const dockerfn = require('./lib/container/docker');

// Define Commands in CLI TOOL
program
  .version('1.0.0', '-v --version')
  .description('A cli tool for MEVN stack.')

program
  .command('init <appname>')
  .description('To init the project')
  .action(initfn);

program
  .command('create:controller')
  .description('To create controllers-file')
  .action(controllersfn);

program
  .command('create:component <componentname>')
  .description('To create component-file')
  .action(componentsfn)

program
  .command('create:route')
  .description('To create router-file')
  .action(routesfn);

program
  .command('create:config')
  .description('To create configuration file for database')
  .action(configfn);

program
  .command('create:model')
  .description('To create models-file')
  .action(modelsfn);

program
  .command('add:package')
  .description('To add a new package to the project')
  .action(addPackagefn)

program
  .command('run:client')
  .description('To run client')
  .action(clientfn);

program
  .command('run:server')
  .description('To run server')
  .action(serverfn);

program
  .command('dockerize')
  .description('To dockerize the app')
  .action(dockerfn)  

program.parse(process.argv);