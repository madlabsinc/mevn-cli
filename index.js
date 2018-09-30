#!/usr/bin/env node

'use strict'

const program = require('commander');

const init = require('./lib/commands/initlib');
const models = require('./lib/commands/modelslib');
const controllers = require('./lib/commands/controllerslib');
const routes = require('./lib/commands/routeslib');
const config = require('./lib/commands/configlib');
const server = require('./lib/run/server');
const client = require('./lib/run/client');

let initcommand = init.initfunction;
let modelscommand = models.modelsfunction;
let controllerscommand = controllers.controllersfunction;
let routescommand = routes.routesfunction;
let configcommand = config.configfunction;
let runserver = server.serverfunction;
let runclient = client.clientfunction;

program
  .version('1.0.0', '-v --version')
  .description('A cli tool for MEVN stack.')

program
  .command('init <appname>')
  .description('To init the project')
  .action(initcommand);

program
  .command('create:controller')
  .description('To create controllers-file')
  .action(controllerscommand);

program
  .command('create:route')
  .description('To create router-file')
  .action(routescommand);

program
  .command('create:config')
  .description('To create configuration file for database')
  .action(configcommand);

program
  .command('create:model')
  .description('To create models-file')
  .action(modelscommand);

program
  .command('run:client')
  .description('To run client')
  .action(runclient);

program
  .command('run:server')
  .description('To run server')
  .action(runserver);

program.parse(process.argv);