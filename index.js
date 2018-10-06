#!/usr/bin/env node

'use strict'

// Require Modules
const program = require('commander');

const init = require('./lib/commands/initlib');
const models = require('./lib/commands/modelslib');
const controllers = require('./lib/commands/controllerslib');
const routes = require('./lib/commands/routeslib');
const config = require('./lib/commands/configlib');
const server = require('./lib/run/server');
const client = require('./lib/run/client');
const docker = require('./lib/container/docker');

// Initialize Command variables
let initcmd = init.initfn;
let modelscmd = models.modelsfn;
let controllerscmd = controllers.controllersfn;
let routescmd = routes.routesfn;
let configcmd = config.configfn;
let runserver = server.serverfn;
let runclient = client.clientfn;
let dockerize = docker.dockerfn;

// Define Commands in CLI TOOL
program
  .version('1.0.0', '-v --version')
  .description('A cli tool for MEVN stack.')

program
  .command('init <appname>')
  .description('To init the project')
  .action(initcmd);

program
  .command('create:controller')
  .description('To create controllers-file')
  .action(controllerscmd);

program
  .command('create:route')
  .description('To create router-file')
  .action(routescmd);

program
  .command('create:config')
  .description('To create configuration file for database')
  .action(configcmd);

program
  .command('create:model')
  .description('To create models-file')
  .action(modelscmd);

program
  .command('run:client')
  .description('To run client')
  .action(runclient);

program
  .command('run:server')
  .description('To run server')
  .action(runserver);

program
  .command('dockerize')
  .description('To dockerize the app')
  .action(dockerize)  

program.parse(process.argv);