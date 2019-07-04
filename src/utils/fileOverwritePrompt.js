'use strict';

import inquirer from 'inquirer';

/**
 * Shows file overwrite prompt
 *
 * @param {String} fileName - Name of the file to be overwritten
 * @param {Function} cb - callback to be executed on completion
 *
 * @returns {any}
 */

const showPrompt = (fileName, cb) => {
  const defaultQuestion = [
    {
      type: 'confirm',
      name: 'overwriteFile',
      message: `${fileName} already exists. Overwrite file?`,
      default: false,
    },
  ];

  return inquirer.prompt(defaultQuestion).then(answer => cb(answer));
};

module.exports = showPrompt;
