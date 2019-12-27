'use strict';

import 'babel-polyfill';
import execa from 'execa';
import path from 'path';

const CLI_PATH = path.resolve(process.cwd(), 'bin', 'mevn.js');

// sync version
export const run = args => execa.sync(CLI_PATH, args);

// async version
export const runAsync = async args => await execa(CLI_PATH, args);
