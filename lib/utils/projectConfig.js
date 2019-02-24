'use strict';

const fs = require('fs');

exports.appData = () => {
  const data = fs.readFileSync(process.cwd() + '/mevn.json', 'utf8');
  return new Promise((resolve) => {
    resolve(JSON.parse(data));
  });
};
