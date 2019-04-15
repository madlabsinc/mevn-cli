# Mevn CLI



## Getting started

A CLI tool for getting started with MEVN stack. It offers a super simple boilerplate project and additional utilities for building a MEVN app. It helps for beginner developers to easily create a template for their Web application development.

## Prerequisites

- [**npm**](https://www.npmjs.com/) it is a package manager for the JavaScript programming language.
- [**node.js**](https://nodejs.org/en/) is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- [**git**](https://git-scm.com/) is a version control system for tracking changes in computer files and coordinating work on those files among multiple people. It is primarily used for source code management in software development.

## Installing

```bash
npm install -g mevn-cli
```

## Quickstart
```bash
npm install -g mevn-cli
mevn init "Desired File Name" 
```
### Initial Command

This command Initialises the project.

```
mevn init appname
```


### Available Commands
 
 These are generic commands for the entire project.

| command | description |                                                                                                
| -------------- |  ---------------- |
| ```mevn serve``` | To launch Client/Server parts as required |
| ```mevn add:package``` | To add additional packages as required |
| ```mevn generate``` | To generate model, route, controller, and DB config files |
| ```mevn create:component <component_name>``` | To create new components as required |
| ```mevn codesplit <component_name>``` | Lazy load components as required |
| ```mevn create:git-repo``` | To create a GitHub repository and fire the first commit |
| ```mevn dockerize``` | To run the client and server in separate docker containers |
| ```mevn deploy``` | To deploy the app to Heroku |

## File Hierarchy
```
| - .github
    | -config.yml
| - bin
    | - mevn.js
| - docs
    | - .vuepress
        | - public
            | - images
                | - hero.png
                | - mevn-logo.jpg
        | - config.js
    | - guide      
        | - README.md
    | - README.md
| - src 
    | - commands
        | - basic
            | - codesplit.js
            | - component.js
            | - createRoute.js
            | - generate.js
            | - init.js
            | - package.js
            | - version.js
        | - deploy
            | - docker.js
            | - gitRepo.js
            | - herokuDeploy.js
        | - serve
            | - launch.js
            | - setup.js
    | - external
        | - banner.js
    | - templates
        | - controllers
            | - user_controller.js
        | - models
            | - user_schema.js
        | - routes
            | - FacebookRoutes.js
            | - GoogleRoutes.js
            | - TwitterRoutes.js
            | - index.js
            | - index_with_passport.js
            | - index_with_social_media_auth.js
        | - vuex
            | - store.js
    | - utils
        | - createFile.js
        | - fileOverwritePrompt.js
        | - messages.js
        | - projectConfig.js
| - test
    | - main_test.js
| - .gitignore
| - .jshintignore
| - .jshintrc
| - .travis.yml
| - CHANGELOG.MD
| - CODE_OF_CONDUCT.md
| - LICENSE.md
| - README.md
| - config.json
| - package-lock.json
| - package.json 
```

## Features

- This tool provides an easy way to build a web app by providing a super simple boilerplate project and a reliable boilerplate pwa to build upon.  
- Its written in ES6 syntax, which is a developer-friendly syntax that keeps the code simpler and smaller.
- The whole project is done in modules(thanks to ES6 syntax) which enhances user readability and much more compact code.  
- Mevn-Cli will automate the files and generate the codes necessary to start and run a server, API etc


## Contributing

Before contributing to this repository, please first discuss the change you wish to make via issue, or any other method with the owners of this repository before making a change. 

### How do I contribute?
1. Ensure you have no "dummy" files left, if you do simply add them to the bottom of the `.gitignore`.
2. Fork and clone our repository.
3. Make your life-changing changes.
4. Commit and push your changes.
5. Make a detailed pull request.

### Why should I contribute?
Contributing helps people and makes the world simply a better place, without contributors this project would cease to exist.

### What if I cannot code or do not like it?
You can always write documentation, most repositories lack in it.

### What is next?
Nothing! You are done and ready to get coding!


## Versioning And Help

| command | description
| --- | --- |
| ```mevn -v``` | Check CLI version |
|``` mevn --help ``` | Get help and check usage |
