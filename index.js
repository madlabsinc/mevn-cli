#!/usr/bin/env node

'use strict'

const program = require('commander')

const init = require('./lib/initlib')

// init function
let initcommand = init.initfunction

program
  .version('1.0.0', '-v --version')
  .description('A cli tool for MEVN stack.')

program
  .command('init <app_name>')
  .description('To init the project')
  .action(initcommand)

program.parse(process.argv)