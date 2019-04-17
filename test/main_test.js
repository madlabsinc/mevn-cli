'use strict';

const path = require('path'),
{ exec } = require('child_process');

const rootCommand = path.join(process.cwd(), 'bin/mevn.js');

describe('mevn', () => {

  it('executes without error', (done) => {
    exec(rootCommand, (err) => {
      if (err) {
        throw err;
      }
      done();
    });
  });

  ['', '-h', '--help'].forEach( (args) => {
    var suffix = args ? '"' + args + '"' : 'no arguments';
    it('shows help when executed with ' + suffix, (done) => {
      exec(rootCommand + ' ' + args, (err, stdout) => {
        if (err) {
          throw err;
        }
        stdout.match(/Usage:\s+mevn/);
	done();
      });
    });
  });

});
