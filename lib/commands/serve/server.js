'use strict';

const shell = require('shelljs');

const { setupProject } = require('./launch');
const { showBanner } = require('../../external/banner');
const { configFileExists } = require('../../utils/messages');

exports.setupServer = () => {
  showBanner();
  configFileExists();

  shell.cd('server');
  setupProject('npm start');
};
