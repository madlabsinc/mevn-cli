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
  .command('init <appname>')
  .description('To init the project')
  .action(initcommand)

program
  .on('--help', () => {
    // tables ..
  })
program.parse(process.argv)