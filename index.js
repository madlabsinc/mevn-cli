#!/usr/bin/env node

'use strict'

const program = require('commander')

const init = require('./lib/commands/initlib')
const models = require('./lib/commands/modelslib')
const controller = require('./lib/commands/controllerlib')
const routes = require('./lib/commands/routeslib')
const services = require('./lib/commands/serviceslib')
const utils = require('./lib/commands/utilslib')
const client = require('./lib/run/client')
const server = require('./lib/run/server')

let initcommand = init.initfunction
let modelscommand = models.modelsfunction
let controllercommand = controller.controllerfunction
let routescommand = routes.routesfunction
let servicescommand = services.servicesfunction
let utilscommand = utils.utilsfunction
let clientcommand = client.clientfunction
let servercommand = server.serverfunction

program
  .version('1.0.0', '-v --version')
  .description('A cli tool for MEVN stack.')

program
  .command('init <appname>')
  .description('To init the project')
  .action(initcommand)

program
  .command('controller <filename>')
  .description('To create controller-file')
  .action(controllercommand)

program
  .command('routes <filename>')
  .description('To create router-file')
  .action(routescommand)

program
  .command('services <filename>')
  .description('To create services-file')
  .action(servicescommand)

program
  .command('utils <filename>')
  .description('To create utils-file')
  .action(utilscommand)

program
  .command('models <filename>')
  .description('To create models-file')
  .action(modelscommand)

program
  .command('run')
  .description('To run client')
  .action(clientcommand)

program
  .command('start')
  .description('To run server')
  .action(servercommand) 

program.parse(process.argv)