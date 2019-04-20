'use strict';

const inquirer = require('inquirer');
const { webpack4 } = require('../../../../webpack4.js');


setTimeout(() => {
    inquirer.prompt([{
        name: 'configure',
        type: 'list',
        message: 'please select one',
        choices: ['Change package manager', 'Change test runners', 'Migrate to webpack 4']
    }])

        .then((choice) => {
            if (choice.configure === 'Migrate to webpack 4') {
                webpack4();
            }

        });

}, 5000);
