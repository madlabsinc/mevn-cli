'use strict';

import 'babel-polyfill';
import execa from 'execa';
import path from 'path';
import inquirerTest from 'inquirer-test';

const CLI_PATH = path.resolve('bin', 'mevn.js');

// sync version
export const run = (args, options = {}) => execa.sync(CLI_PATH, args, options);

export const runPromptWithAnswers = (args, answers) =>
  inquirerTest([CLI_PATH].concat(args), answers, 500);

// async version
export const runAsync = async (args, options = {}) =>
  await execa(CLI_PATH, args, options);
