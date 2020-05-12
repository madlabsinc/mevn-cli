'use strict';

import fs from 'fs';

/**
 * Returns data regarding the project from .mevnrc
 *
 * @returns {Promise<any>}
 */

const appData = () => {
  return JSON.parse(fs.readFileSync('.mevnrc', 'utf8'));
};

module.exports = appData;
