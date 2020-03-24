'use strict';

import fs from 'fs';

/**
 * Returns data regarding the project from .mevnrc
 *
 * @returns {Promise<any>}
 */

const appData = () => {
  const data = fs.readFileSync(process.cwd() + '/.mevnrc', 'utf8');
  return new Promise(resolve => resolve(JSON.parse(data)));
};

module.exports = appData;
