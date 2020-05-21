# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# v1.7.5

## What's new

- Generate route entries conditionally based on the user choice. Firing in `mevn generate` now prompts the user whether he requires a UI component / page component.
- Inherits `stdio` for `mevn serve`. As opposed to showing up a spinner, now the direct output is being logged.

## Bug fixes

- Fixed `Vuetify` installation with `Nuxt.js`

# v1.7.0

## What's new

- Use of dot file to store information specific to the project, `mevn.json` -> `.mevnrc`
- Revamped `deploy` experience. (#151)
- Fixed the inconsistencies with `serve` command in which the browser window won't open up at times. (#164)
- `mevn generate` won't show up all the options unless you're having a full-stack app.
-  Other fixes adding to the DX.

## Issues closed

- [#151](https://github.com/madlabsinc/mevn-cli/issues/151) 
- [#164](https://github.com/madlabsinc/mevn-cli/issues/164)

# v1.6.5

## Bug fixes

- Fixed a critical bug in the previous release [1.6.2](https://github.com/madlabsinc/mevn-cli/releases/tag/v1.6.2)
- Fixed [#148](https://github.com/madlabsinc/mevn-cli/issues/148)

## Features

- Warn if the user attempts to create yet another app within a valid MEVN stack project
 - Updated banner

# v1.6.2

> Deprecated

Introduced a critical bug fixed in [1.6.5](https://github.com/madlabsinc/mevn-cli/releases/tag/v1.6.5)

# v1.6.1

## Fix

- Critical bug fix (Configure `@babel/polyfill`)

# v1.6.0

## Features

- Revamped commands
- Supports `surge.sh` for SPA deployments
- Better refactored code-base
- Automates the process of updating route config within `main.js` on generating components with `mevn generate`
- Out of the box support to add new plugins and lazy load components as required
- Use `mevn add` to install additional plugins on the go.

## Internal changes

- Switch to a single repository for the boilerplate templates: [mevn-starter-kit](http://github.com/madlabsinc/mevn-starter-templates)


## Breaking changes

- Rename `mevn add:package` to `mevn add`

# v1.5.1

## Fixes

- Removed unworth logs.
- Minor bug fixes.

## v1.5.0

## Internal Changes

- Critical bug fixes.
- Code refactor.
- Use [node-banner](https://npmjs.com/package/node-banner) for displaying banner.

## Removed dependencies

- shelljs
- figlet
- clear


# v1.4.8

## Internal changes

- Minor change in directory hierarchy
- Add constants entry
- Updated banner

## Other changes

- Update Docs
- Minor bug fixes

# v1.4.7

## Fixes

- Updated the commands list to be in sync with the latest changes (`mevn init`).
- Docs update

# v1.4.6

## Fixes

Minor bug fixes - (validate installation) 

## Commits

- [0da5058](https://github.com/madlabsinc/mevn-cli/commit/0da5058cc2c2ca890bf6e93102a33ee7cc971e14)
- [f564f8f](https://github.com/madlabsinc/mevn-cli/commit/f564f8fca737749834f53cfa5b8fb9374877f7f7)

# v1.4.5

## Features

- Provides `pwa` support for the `Nuxt-js` template. #74 
- `mevn deploy` works out of the box.
- Slightly updated banner.

## Internal Changes

- Use  [open](https://npmjs.com/package/open) instead of [opn](https://npmjs.com/package/opn) (deprecated).
- Avoid the use of `os` module.
- Adopted a promisified approach rather than using`deferExec()` in-order to cope up with the `async` nature.

- Other minor bug fixes

# v1.4.3

## API Changes

- Suggest matching commands
- New `info` command that prints local environment information
- Use `-v, --version` options and deprecate `version` command
- Updated demo

# v1.4.1

## Fixes

- Fixed a minor bug (Showing up incorrect path). [0be5821](https://github.com/madlabsinc/mevn-cli/commit/0be5821355a76c680c9c503f2f19a9200be26832)

# v1.4.0

## API change

## Breaking changes

- Removed `create:git-repo` command and made it such that an initial commit is made with `mevn init`.
- Removed `create:component` command included it as part of `generate`.

## Other changes

- Improvements to the code-base
- Minor bug fixes [#111](https://github.com/madlabsinc/mevn-cli/pull/111)

# v1.3.5

## Fixes

> Fixed a bug encountered while installing the package via `npm`

# v1.3.3

## Fixes

> Minor tweaks

# v1.3.2

## Fixes

> Bugs fixed

# v1.3.1

## Fixes

> Minor bug fix

# v1.3.0

## Fixes

> This release beings about improvements to the codebase such as:-

- Use ESM import statement to include the required dependencies.
- Migrate from `Jshint` to `eslint` with babel and prettier presets.
- Minor changes to project structure
- Minor bug fixes

# v1.2.8

## Fixes

- [c5f17e7](https://github.com/madlabsinc/mevn-cli/commit/c5f17e796bd37c53c4be73eec9973cb837799ecb) - Fixed the bugs with validating `git` installation


# v1.2.7

## Fixes

> Prompts the user if the required dependencies to work with are not installed and proceeds with the installation as per choice.

## Commits

- [15e81c7](https://github.com/madlabsinc/mevn-cli/commit/15e81c70729943ea76c504e418c1dee342b8ba23) 
- [788709c](https://github.com/madlabsinc/mevn-cli/commit/788709c089415d259d6d9a69fdfdd8a4b6265fd1)
- [6ded326](https://github.com/madlabsinc/mevn-cli/commit/6ded326adb306b5c8bb6686deacacd914d3fb49f)

# v1.2.5

## Fixes

- [1978efd](https://github.com/madlabsinc/mevn-cli/commit/1978efd84ab4a1de8bfcc5b6ad8c0b19a4b78afc) - Fixed the bug encountered while serving the template.

# v1.2.3

## Fixes

- [dbdce46](https://github.com/madlabsinc/mevn-cli/commit/dbdce46b58e99abf2046cec88905c89e3cb8d8e8) - Fixed the bug while serving GraphQL template.

# v1.2.1

## Commits

- [2586204](https://github.com/madlabsinc/mevn-cli/commit/25862045f8956681bcf4d3e7661ef222007a243e)
- [0f378c0](https://github.com/madlabsinc/mevn-cli/commit/0f378c0a5347ac5c643df4fd14be03c0a6b50e84)
- [594e030](https://github.com/madlabsinc/mevn-cli/commit/594e030b017a04d18c2acf5a23342a40c3993138)

# v1.2.0

## Breaking Changes

- Change `mevn run:client/server` to `mevn serve`

## Commits

- [a633004](https://github.com/madlabsinc/mevn-cli/commit/a633004513021766bae8f4dbff81a674aaaff0c1)
- [44fc9e3](https://github.com/madlabsinc/mevn-cli/commit/44fc9e34075a363fc05a02753716e31e46ddce2e)

# v1.1.9

## Fixes

- [2c838dc](https://github.com/madlabsinc/mevn-cli/commit/2c838dc8d1b2be78bc76633ae3f93b97ff408a8a) - Shows up required warnings if mevn generate is used with graphql boilerplate

# v1.1.8

## Fixes

- [d01f6b2](https://github.com/madlabsinc/mevn-cli/commit/d01f6b21459de1ecc5ca5e7c3ec300318c4648d9) - Replaced create file commands with a generate command.
- [2e334d5](https://github.com/madlabsinc/mevn-cli/commit/2e334d59f110911f1dc15f66f13eea07f1360331) - 
Migrate to `cli-table3`
- Docs related updates

# v1.1.5

## Fixes

- [#92](https://github.com/madlabsinc/mevn-cli/pull/92) - Validates docker installation locally
- [#93](https://github.com/madlabsinc/mevn-cli/pull/93) - Update file hierarchy within docs
- [#94](https://github.com/madlabsinc/mevn-cli/pull/94) - Validation for heroku-cli installation

# v1.1.0

## Changes

- [`0584d59`](https://github.com/madlabsinc/mevn-cli/commit/0584d59106333ad9ebffde2c9c3b972414d7b41e) Update demo within Docs

# v1.0.9

## Fixes

- Fixed a bug that arised when a directory having same name as the boilerplate template already exists in the current path [#88](https://github.com/madlabsinc/mevn-cli/pull/88)

# v1.0.8

## Fixes

- Fix for [#86](https://github.com/madlabsinc/mevn-cli/pull/86) - now you can find `mevn.json` within the new project being created

# v1.0.5

## Fixes

- Fixed bug while fetching the Nuxt-js template
- Other minor bug fixes

# v1.0.1

## Fixes

- Core functionalities implemented.

# v0.0.2

## Fixes

- Bug fixes and code cleanup
- Update README.md
- Test vuepress for docs

# v0.0.1

## Initial release

- Includes basic functionalities.
