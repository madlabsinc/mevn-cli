<p align="center">
<img src="https://i.imgur.com/NV51t84.jpg" width="350px">
</p>

# Mevn-CLI
[![Build Status](https://travis-ci.com/madlabsinc/mevn-cli.svg?branch=master)](https://travis-ci.com/madlabsinc/mevn-cli)
[![npm version](https://badgen.net/npm/v/mevn-cli)](https://www.npmjs.com/package/mevn-cli)
[![Downloads](https://badgen.net/npm/dm/mevn-cli)](https://www.npmjs.com/package/mevn-cli)
[![PRs Welcome](https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg)](https://github.com/madlabsinc/mevn-cli/pull/new)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![dependencies Status](https://david-dm.org/madlabsinc/mevn-cli/status.svg)](https://david-dm.org/madlabsinc/mevn-cli)
[![devDependencies Status](https://david-dm.org/madlabsinc/mevn-cli/dev-status.svg)](https://david-dm.org/madlabsinc/mevn-cli?type=dev)
[![Mentioned in Awesome-Vue](https://awesome.re/mentioned-badge.svg)](https://github.com/vuejs/awesome-vue)
[![Mentioned in Awesome-VuePress](https://awesome.re/mentioned-badge.svg)](https://github.com/ulivz/awesome-vuepress)

A CLI tool for getting started with the MEVN stack. It offers a super simple boilerplate template and additional utilities for building a MEVN stack based webapp. It takes away the hassle of setting up the local development environment which may become a nightmare especially for beginners who are just starting out.

- [Basic](https://github.com/Madlabsinc/mevn-boilerplate)
- [Pwa](https://github.com/MadlabsInc/mevn-pwa-boilerplate)
- [GraphQL](https://github.com/MadlabsInc/mevn-graphql-boilerplate)
- [Nuxt.js](https://github.com/MadlabsInc/mevn-nuxt-boilerplate)

## Installation

### Prerequisites

- [**npm**](https://www.npmjs.com/) it is a package manager for the JavaScript programming language.
- [**node.js**](https://nodejs.org/en/) is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- [**git**](https://git-scm.com/) is a version control system for tracking changes in computer files and coordinating work on those files among multiple people. It is primarily used for source code management in software development.

## Quickstart

``` bash
npm install -g mevn-cli
mevn init <appname>
```

### Available Commands

 `Mevn-CLI` offers the following set of commands:-

| command | description |                                                                                                
| -------------- |  ---------------- |
| mevn init | Bootstraps a MEVN stack based boilerplate template of choice |
| mevn serve | Serves the client/server side template locally |
| mevn add:package | Adds additional packages as required on the go |
| mevn generate | Generates component, model, route, controller, and DB config files |
| mevn codesplit &lt;name&gt; | Lazy load components as required |
| mevn dockerize | Serves the client and server in separate docker containers |
| mevn deploy | Deploys the webapp to a cloud service of choice |
| mevn info | Prints debugging information about the local environment |

## Features

- It allows Developers to build webapps with ease in which all the local environment setup is being taken care of. All he/she has to do is to focus on writing actual code. 
- Its written in ES6 syntax, which is a developer-friendly syntax that keeps the code simpler and smaller.
- The whole project is done in modules(thanks to ES6 syntax) which enhances user readability and much more compact code.  
- Mevn-CLI simplifies the entire workflow by generating boilerplate code as required, automating redundant tasks etc.

## Demo

[![Demo](https://asciinema.org/a/248209.svg)](https://asciinema.org/a/248209)

## Contributing

Before contributing to this repository, please first discuss the change you wish to make via issue, or any other method with the owners of this repository before making a change. Take a look at the [Contributing Guidelines](https://github.com/madlabsinc/mevn-cli/wiki/Contributing-Guidelines) to get a better picture regarding the codebase and project structure.

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

| option | description
| --- | --- |
| -V, --version | Check CLI version |
| -h, --help | Get help and check usage |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
