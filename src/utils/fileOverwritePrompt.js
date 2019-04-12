'use strict';

import inquirer from 'inquirer';

exports.showPrompt = (fileName, cb) => {
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
