'use strict';

import execa from 'execa';
import path from 'path';

const CLI_PATH = path.resolve(process.cwd(), 'bin', 'mevn.js');

export const run = args => execa.sync(CLI_PATH, args);
