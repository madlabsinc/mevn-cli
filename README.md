<p align="center">
	<a href="https://mevn.madlabs.xyz"><img src="https://i.imgur.com/NV51t84.jpg" width="350px" /></a>
	<p align="center"> Light speed setup for MEVN stack based web-apps </p>
</p>

<p align="center">
	<a href="https://travis-ci.com/madlabsinc/mevn-cli"><img src="https://travis-ci.com/madlabsinc/mevn-cli.svg?branch=master" alt="Build Status" /></a>
	<a href="https://www.npmjs.com/package/mevn-cli"><img src="https://badgen.net/npm/v/mevn-cli" alt="npm version" /></a>
	<a href="https://www.npmjs.com/package/mevn-cli"><img src="https://badgen.net/npm/dm/mevn-cli" alt="Downloads" /></a>
	<a href="https://github.com/madlabsinc/mevn-cli/pull/new"><a href="https://opencollective.com/mevn-cli" alt="Financial Contributors on Open Collective"><img src="https://opencollective.com/mevn-cli/all/badge.svg?label=financial+contributors" /></a>
	<a href="https://mevn.madlabs.xyz/guide/contributing.html#how-do-i-contribute"><img src="https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
	<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="code style: prettier" /></a>
	<a href="https://github.com/vuejs/awesome-vue"><img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome-Vue" /></a>
	<a href="https://github.com/ulivz/awesome-vuepress"><img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome-VuePress" /></a>
	<a title="MadeWithVueJs.com Shield" href="https://madewithvuejs.com/p/mevn-cli/shield-link"><img src="https://madewithvuejs.com/storage/repo-shields/1823-shield.svg"/></a>
	<a title="Chat on Telegram" href="https://t.me/mevn_cli"> <img src="https://img.shields.io/badge/chat-Telegram-blueviolet?logo=Telegram"/></a>
	<a href="https://twitter.com/intent/follow?screen_name=mevn_cli"><img src="https://img.shields.io/twitter/follow/mevn_cli.svg?style=social&label=Follow%20@mevn_cli" alt="Follow on Twitter"></a>
</p>

<p align="center">
	<a href='https://www.buymeacoffee.com/jamesgeorge007' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' /></a>
</p>

---

**Chat: _[Telegram](https://t.me/mevn_cli)_**

**Donate: [PayPal](https://www.paypal.me/jamesgeorge007), _[Open Collective](https://www.opencollective.com/mevn-cli), [Patreon](https://www.patreon.com/jamesgeorge007)_**

A CLI tool for getting started with the MEVN stack. The acronym “MEVN” stands for “MongoDB Express.js VueJS Node.js”. It offers a super-simple boilerplate template and additional utilities for building a MEVN stack-based webapp. It takes away the hassle of setting up the local development environment which may become a nightmare especially for beginners who are just starting.

## Installation

### Prerequisites

- [**npm**](https://www.npmjs.com/) is a package manager for the JavaScript programming language.
- [**node.js**](https://nodejs.org/en/) is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- [**git**](https://git-scm.com/) is a version control system for tracking changes in computer files and coordinating work on those files among multiple people. It is primarily used for source code management in software development.

## Quickstart

``` bash
npm install -g mevn-cli
mevn init <appname>
```

### Available Commands

 `MEVN-CLI` offers the following set of commands:-

| command | description |                                                                                                
| -------------- |  ---------------- |
| mevn init &lt;appname&gt; | Scaffolds a MEVN stack project in the current path |
| mevn serve | Serves the client/server side template locally |
| mevn add [deps] [--dev] | Adds additional dependencies as required on the go |
| mevn generate | Generates component files for the client and CRUD boilerplate template for the server based on MVC architecture |
| mevn codesplit | Lazy load components as required |
| mevn dockerize | Serves the webapp as multi-container Docker applications |
| mevn deploy | Deploys the webapp to a cloud service of choice |
| mevn info | Prints debugging information about the local environment |

## Features

- It allows Developers to build webapps with ease in which all the local environment setup is being taken care of. All they have to do is to focus on writing actual code.
- The whole project is done in modules(thanks to ES6 syntax) which enhances user readability and leads to compact code.  
- MEVN-CLI simplifies developer workflow by generating the required boilerplate and automating redundant tasks.

## Contributing

Before contributing a change to this repository, please first discuss the change you wish to make via issue, or any other method with the owners of this repository . Take a look at the [Contributing Guidelines](https://github.com/madlabsinc/mevn-cli/wiki/Contributing-Guidelines) to get a better picture regarding the codebase and project structure.

### How do I contribute?
1. Ensure you have no "dummy" files left, if you do then add them to the bottom of `.gitignore`.
2. Fork and clone our repository.
3. Make your life-changing changes.
4. Run `npm run build` which generates a `lib` directory with the transpiled `es5` code.
5. Type in `npm link` to test everything works fine. (Now you've access to the `mevn` root-command.)
6. Run tests locally before commiting with `npm test`. (If you're having issues running tests locally, then you can commit and use GitHub actions ci in your own fork. All tests should pass.)
7. Commit and push your changes.
8. Make a detailed pull request.

> `npm link` creates a symlink in the global folder making the `mevn` command globally available within your local development environment

### Why should I contribute?
Contributing helps people and simply makes the world a better place, Without contributors this project would cease to exist.

### How should I write a commit message?
This project uses [Commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) to check if the commit messages meet the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/).
The full pattern is:
```sh
type(scope?): subject #scope is optional

body? #body is optional

footer? #footer is optional
```

Following that pattern, your commit messages should look like these:
```sh
feat: activate open collective
```

```sh
chore: correct typo

It should be "guest" and not "gest"
```

```sh
refactor(cli): drop support for node 6

BREAKING CHANGE: you will need to update your node version to keep using this CLI
This closes #123
```

### What if I cannot code or do not like it?
You can always write documentation, most repositories lack in it.

### What is next?
Nothing! You're done and ready to get coding!


## Versioning And Help

| option | description
| --- | --- |
| -V, --version | Check CLI version |
| -h, --help | Get help and check usage |

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/madlabsinc/mevn-cli/wiki/Contributing-Guidelines)].
<a href="https://github.com/madlabsinc/mevn-cli/graphs/contributors"><img src="https://opencollective.com/mevn-cli/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/mevn-cli/contribute)]

#### Individuals

<a href="https://opencollective.com/mevn-cli"><img src="https://opencollective.com/mevn-cli/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/mevn-cli/contribute)]

<a href="https://opencollective.com/mevn-cli/organization/0/website"><img src="https://opencollective.com/mevn-cli/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/1/website"><img src="https://opencollective.com/mevn-cli/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/2/website"><img src="https://opencollective.com/mevn-cli/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/3/website"><img src="https://opencollective.com/mevn-cli/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/4/website"><img src="https://opencollective.com/mevn-cli/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/5/website"><img src="https://opencollective.com/mevn-cli/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/6/website"><img src="https://opencollective.com/mevn-cli/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/7/website"><img src="https://opencollective.com/mevn-cli/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/8/website"><img src="https://opencollective.com/mevn-cli/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/mevn-cli/organization/9/website"><img src="https://opencollective.com/mevn-cli/organization/9/avatar.svg"></a>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
