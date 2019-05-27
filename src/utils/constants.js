'use strict';

// Detecting host OS.

const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';

module.exports = {
  isWin,
  isLinux,
  isMac,
};
