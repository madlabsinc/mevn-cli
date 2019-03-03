'use strict';

const shell = require('shelljs');

const { setupProject } = require('./launch');
const { appData } = require('../../utils/projectConfig');
const { showBanner } = require('../../external/banner');

exports.setupClient = () => {
  showBanner();

  appData()
  .then((data) => {
    if (data.template !== 'Nuxt-js') {
      shell.cd('client');
    }
    setupProject('npm run dev');
  });
};
