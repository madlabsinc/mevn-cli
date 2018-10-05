const inquirer = require('inquirer');

showPrompt = (fileName, cb) => {
  const defaultQuestion = [{
    type: 'confirm',
    name: 'overwriteFile',
    message: `${fileName} already existis. Overwrite file?`,
    default: false,
  }];

  return inquirer.prompt(defaultQuestion).then(answer => cb(answer));
}

module.exports = showPrompt;
