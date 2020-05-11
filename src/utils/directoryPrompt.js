import inquirer from 'inquirer';

const dirOfChoice = () => {
  return inquirer.prompt({
    name: 'dir',
    type: 'list',
    message: 'Choose from below',
    choices: ['client', 'server'],
  });
};

module.exports = dirOfChoice;
