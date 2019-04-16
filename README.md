# Mevn-Cli
[![Build Status](https://travis-ci.com/madlabsinc/mevn-cli.svg?branch=master)](https://travis-ci.com/madlabsinc/mevn-cli)
[![npm version](https://badgen.net/npm/v/mevn-cli)](https://www.npmjs.com/package/mevn-cli)
[![Downloads](https://badgen.net/npm/dm/mevn-cli)](https://www.npmjs.com/package/mevn-cli)
[![PRs Welcome](https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg)](https://github.com/madlabsinc/mevn-cli/pull/new)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![dependencies Status](https://david-dm.org/madlabsinc/mevn-cli/status.svg)](https://david-dm.org/madlabsinc/mevn-cli)
[![devDependencies Status](https://david-dm.org/madlabsinc/mevn-cli/dev-status.svg)](https://david-dm.org/madlabsinc/mevn-cli?type=dev)

A CLI tool for getting started with MEVN stack. It offers various reliable boilerplates as given below and additional utilities for building a MEVN app. It helps out, beginner developers to easily create a template for their Web application development.

- [Basic](https://github.com/Madlabsinc/mevn-boilerplate)
- [Pwa](https://github.com/MadlabsInc/mevn-pwa-boilerplate)
- [GraphQL](https://github.com/MadlabsInc/mevn-graphql-boilerplate)
- [Nuxt.js](https://github.com/MadlabsInc/mevn-nuxt-boilerplate)

## Getting Started

 Currently, this tool works on the Windows and Linux platform.


### Prerequisites

- npm - It is the package manager for node.
- Node.js -Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- Git - Git is a version control system for tracking changes in computer files and coordinating work on those files among multiple people. It is primarily used for source code management in software development.

### Installing

To install the package:-
> npm install -g mevn-cli

## Commands


### Initial Command

This command Initialises the project.
> mevn init <app_name>

### Available Commands

 These are the various commands available for use.

| command | description |                                                                                                
| -------------- |  ---------------- |
| `mevn serve` | To launch Client/Server parts as required |
| `mevn add:package` | To add additional packages as required |
| `mevn generate` | To generate model, route, controller, and DB config files |
| `mevn create:component <component_name>` | To create new components as required |
| `mevn codesplit <component_name>` | Lazy load components as required |
| `mevn create:git-repo` | To create a GitHub repository and fire the first commit |
| `mevn dockerize` | To run the client and server in separate docker containers |
| `mevn deploy` | To deploy the app to Heroku |

## Features

- This tool provides an easy way to build a web app by providing a super simple boilerplate project and a reliable boilerplate pwa to build upon.  
- Its written in ES6 syntax, which is a developer-friendly syntax that keeps the code simpler and smaller.
- The whole project is done in modules(thanks to ES6 syntax) which enhances user readability and much more compact code.  
- Mevn-Cli will automate the files and generate the codes necessary to start and run a server, API etc

## Demo

[![Demo](https://asciinema.org/a/233020.svg)](https://asciinema.org/a/233020)

## Contributing

Before contributing to this repository, please first discuss the change you wish to make via issue, or any other method with the owners of this repository before making a change. Kindly have a look at the [Contributing Guidelines](https://github.com/madlabsinc/mevn-cli/wiki/Contributing-Guidelines) to know more regarding the codebase and project structure.

### How do I contribute?
1. Ensure you have no "dummy" files left, if you do then add them to the bottom of `.gitignore`.
2. Fork and clone our repository.
3. Make your life-changing changes.
4. Run `npm run compile` which generates a `lib` directory with the transpiled `es5` code.
5. Fire in `sudo npm link` to test everything works fine.
6. Commit and push your changes.
7. Make a detailed pull request.

> `npm link` creates a symlink in the global folder making the `mevn` command globally available within your local development environment

### Why should I contribute?
Contributing helps people and makes the world simply a better place, without contributors this project would cease to exist.

### What if I cannot code or do not like it?
You can always write documentation, most repositories lack in it.

### What is next?
Nothing! You're done and ready to get coding!


## Versioning And Help

| command | description
| --- | --- |
| ```mevn version``` | Check CLI version |
|``` mevn --help ``` | Get help and check usage |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
