'use strict';

const path = require('path'),
{ exec } = require('child_process');

const command = path.join(process.cwd(), 'bin/index.js');

describe('mevn', () => {

  it('executes without error', (done) => {
    exec(command, (err) => {
      if (err) {
        throw err;
      }
      done();
    });
  });
});