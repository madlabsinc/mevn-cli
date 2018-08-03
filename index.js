#!/usr/bin/env node

'use strict'

const program = require('commander')

const init = require('./lib/initlib')
const models = require('./lib/modelslib')
const controller = require('./lib/controllerlib')
const routes = require('./lib/routeslib')
const services = require('./lib/serviceslib')
const utils = require('./lib/utilslib')

let initcommand = init.initfunction
let modelscommand = models.modelsfunction
let controllercommand = controller.controllerfunction
let routescommand = routes.routesfunction
let servicescommand = services.servicesfunction
let utilscommand = utils.utilsfunction

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
  .description('To create utils-file')
  .action(utilscommand)

program
  .command('run client')
  .description('To create utils-file')
  .action(utilscommand)

program.parse(process.argv)