'use strict'

import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import Table from 'cli-table3'
import validate from 'validate-npm-package-name'

import { isWin } from '../../utils/constants'
import {
    directoryExistsInPath,
    hasStrayArgs,
    invalidProjectName,
} from '../../utils/messages'
import { showBanner } from '../../utils/banner'
import Spinner from '../../utils/spinner'
import { validateInstallation } from '../../utils/validate'

let availableCommands = new Table()

let projectName
let projectConfig

const boilerplate = {
    basic: 'https://github.com/madlabsinc/mevn-boilerplate.git',
    pwa: 'https://github.com/madlabsinc/mevn-pwa-boilerplate.git',
    graphql: 'https://github.com/madlabsinc/mevn-graphql-boilerplate.git',
    nuxt: 'https://github.com/madlabsinc/mevn-nuxt-boilerplate.git',
}

const addToScripts = utility => {
    const fileToBeWritten = JSON.parse(
        fs.readFileSync(path.resolve('package.json')).toString(),
    )
    if (
        utility !== 'prettier' &&
        utility !== 'prettier-eslint' &&
        utility !== 'none'
    ) {
        fileToBeWritten['scripts'][
            'lint'
        ] = `node ./node_modules/${utility}/bin/${utility}`
    } else {
        fileToBeWritten['scripts']['prettify'] =
            "prettier --single-quote --write '**/{*.js,*.jsx}'"
    }
    fs.writeFileSync(
        path.resolve('package.json'),
        JSON.stringify(fileToBeWritten),
    )
}

// add .rc and .ignore files to the resepctive directories
const createLinterUtilityConfig = async utility => {
    const templateFile = fs
        .readFileSync(
            `${__dirname}/../../../src/templates/linter/.${utility}rc.js`,
        )
        .toString()
    await execa.shell('touch .' + utility + 'rc.js')
    await execa.shell('touch .' + utility + 'ignore')
    fs.writeFileSync(`./.${utility}rc.js`, templateFile)
}

// Install utility with specified configuration
const installLintUtility = async (cmd, templateDir) => {
    const utility = cmd
        .split(' ')
        .slice(-1)
        .pop()

    const installSpinner = new Spinner(`Installing ${utility} for your project`)
    installSpinner.start()

    // Hop over to the client directory except for the case of Nuxt-js template
    if (templateDir === 'client') {
        process.chdir(path.resolve(process.cwd(), projectName, 'client'))
    } else {
        process.chdir(path.resolve(process.cwd(), projectName))
    }

    try {
        await execa.shell(cmd)
        await addToScripts(utility)
        await createLinterUtilityConfig(utility)
    } catch (err) {
        installSpinner.fail('Something went wrong')
        process.exit(1)
    }

    // Doesn't show up for some reason
    installSpinner.text = `Installing ${utility} for Server`

    // Navigate to the server directory: If else check since Nuxt doesn't have a client dir
    if (templateDir !== '') {
        process.chdir(
            path.resolve(process.cwd(), `../../${projectName}`, 'server'),
        )
    } else {
        process.chdir(
            path.resolve(process.cwd(), `../${projectName}`, 'server'),
        )
    }
    try {
        await execa.shell(cmd)
        await addToScripts(utility)
        await createLinterUtilityConfig(utility)
    } catch (err) {
        installSpinner.fail('Something went wrong')
        process.exit(1)
    }

    // revert back to the project root
    process.chdir('../..')

    installSpinner.succeed(`Succcessfully installed ${utility}`)
}

// Configure settings for the Linter Utility
const configureLintUtility = async (template, linter, requirePrettier) => {
    let templateDir = ''
    if (template !== 'nuxt') templateDir = 'client'
    // Installs the linter of choice.
    if (linter !== 'none')
        await installLintUtility(`npm i -D ${linter}`, templateDir)

    // Install prettier
    if (requirePrettier) {
        if (linter !== 'eslint') {
            // Configure prettier for jshint and jslint
            await installLintUtility('npm i -D prettier', templateDir)
        } else {
            // Configure eslint-prettier presets.
            await installLintUtility('npm i -D prettier-eslint', templateDir)
        }
    }
}

const makeInitialCommit = async () => {
    process.chdir(projectName)
    await execa('git', ['init'])
    await execa('git', ['add', '.'])
    await execa('git', [
        'commit',
        '-m',
        'Initial commit',
        '-m',
        'From Mevn-CLI',
    ])
}

const showCommandList = () => {
    console.log(chalk.yellow('\n Available commands:-'))

    availableCommands.push(
        {
            'mevn init': 'To bootstrap a MEVN webapp',
        },
        {
            'mevn serve': 'To launch client/server',
        },
        {
            'mevn add:package': 'Add additional packages',
        },
        {
            'mevn generate': 'To generate config files',
        },
        {
            'mevn codesplit <name>': 'Lazy load components',
        },
        {
            'mevn dockerize': 'Launch within docker containers',
        },
        {
            'mevn deploy': 'Deploy the app to Heroku',
        },
        {
            'mevn info': 'Prints local environment information',
        },
    )
    console.log(availableCommands.toString())

    console.log(
        chalk.cyanBright(
            `\n\n Make sure that you've done ${chalk.greenBright(
                `cd ${projectName}`,
            )}`,
        ),
    )
    console.log(
        `${chalk.yellow.bold('\n Warning: ')} Do not delete the mevn.json file`,
    )

    let removeCmd = isWin ? 'rmdir /s /q' : 'rm -rf'
    execa.shellSync(`${removeCmd} ${path.join(projectName, '.git')}`)
    makeInitialCommit()
}

const fetchTemplate = async template => {
    await validateInstallation('git')

    const fetchSpinner = new Spinner('Fetching the boilerplate template')
    fetchSpinner.start()
    try {
        await execa(`git`, ['clone', boilerplate[template], projectName])
    } catch (err) {
        fetchSpinner.fail('Something went wrong')
        throw err
    }

    fetchSpinner.stop()

    fs.writeFileSync(
        `./${projectName}/mevn.json`,
        projectConfig.join('\n').toString(),
    )

    // Prompts asking for the linter of choice and prettier support.

    const { linterOfChoice } = await inquirer.prompt([
        {
            name: 'linterOfChoice',
            type: 'list',
            message: 'Please select your favourite linter',
            choices: ['eslint', 'jslint', 'jshint', 'none'],
        },
    ])

    const { requirePrettier } = await inquirer.prompt([
        {
            name: 'requirePrettier',
            type: 'confirm',
            message: 'Do you require Prettier',
        },
    ])

    await configureLintUtility(template, linterOfChoice, requirePrettier)

    if (template === 'nuxt') {
        const { requirePwaSupport } = await inquirer.prompt([
            {
                name: 'requirePwaSupport',
                type: 'confirm',
                message: 'Do you require pwa support',
            },
        ])

        if (requirePwaSupport) {
            let configFile = JSON.parse(
                fs.readFileSync(`./${projectName}/mevn.json`).toString(),
            )
            configFile['isPwa'] = true
            fs.writeFileSync(
                `./${projectName}/mevn.json`,
                JSON.stringify(configFile),
            )
        }

        const { mode } = await inquirer.prompt([
            {
                name: 'mode',
                type: 'list',
                message: 'Choose your preferred mode',
                choices: ['Universal', 'SPA'],
            },
        ])

        if (mode === 'Universal') {
            let configFile = fs
                .readFileSync(`./${projectName}/nuxt.config.js`, 'utf8')
                .toString()
                .split('\n')

            let index = configFile.indexOf(
                configFile.find(line => line.includes('mode')),
            )
            configFile[index] = ` mode: 'universal',`

            fs.writeFileSync(
                `./${projectName}/nuxt.config.js`,
                configFile.join('\n'),
            )
        }
    }
    showCommandList()
}

exports.initializeProject = async appName => {
    await showBanner()

    const hasMultipleProjectNameArgs =
        process.argv[4] && !process.argv[4].startsWith('-')

    // Validation for multiple directory names
    if (hasMultipleProjectNameArgs) {
        hasStrayArgs()
    }

    const validationResult = validate(appName)
    if (!validationResult.validForNewPackages) {
        invalidProjectName(appName)
    }

    if (fs.existsSync(appName)) {
        directoryExistsInPath(appName)
    }

    projectName = appName

    let { template } = await inquirer.prompt([
        {
            name: 'template',
            type: 'list',
            message: 'Please select your template of choice',
            choices: ['basic', 'pwa', 'graphql', 'Nuxt-js'],
        },
    ])

    projectConfig = [
        '{',
        `"name": "${appName}",`,
        `"template": "${template}"`,
        '}',
    ]

    if (template === 'Nuxt-js') {
        template = 'nuxt'
    }

    fetchTemplate(template)
}
