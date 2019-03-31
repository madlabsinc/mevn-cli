const inquirer = require('inquirer');
const { dockerize } = require('./docker');
const { createRepo } = require('./gitRepo');
const { herokuDeploy } = require('./herokuDeploy');

exports.deploy = () => {
  inquirer.prompt([{
    name: 'deployMode',
    type: 'list',
    message: 'Please select mode of deployment',
    choices: ['GitHub', 'Heroku', 'Docker']
  }]).then((choice) => {
    const mapper = { 'GitHub': createRepo, 'Heroku': herokuDeploy, 'Docker': dockerize }
    mapper[choice.deployMode]();
  });
}