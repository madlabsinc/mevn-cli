'use strict';

import inquirer from 'inquirer';

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
