# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.4.5

### Features

- Provides `pwa` support for the `Nuxt-js` template. #74 
- `mevn deploy` works out of the box.
- Slightly updated banner.

### Breaking changes

- Use  [open](https://npmjs.com/package/open) instead of [opn](https://npmjs.com/package/opn) (deprecated).
- Avoid the use of `os` module.
- Adopted a promisified approach rather than using`deferExec()` in-order to cope up with the `async` nature.

- Other minor bug fixes

## v1.4.3

### API Changes

- Suggest matching commands
- New `info` command that prints local environment information
- Use `-v, --version` options and deprecate `version` command
- Updated demo

## v1.4.1

### Fixes

- Fixed a minor bug (Showing up incorrect path). [0be5821](https://github.com/madlabsinc/mevn-cli/commit/0be5821355a76c680c9c503f2f19a9200be26832)

## v1.4.0

### API change

### Breaking changes

- Removed `create:git-repo` command and made it such that an initial commit is made with `mevn init`.
- Removed `create:component` command included it as part of `generate`.

### Other changs

- Improvements to the code-base
- Minor bug fixes [#111](https://github.com/madlabsinc/mevn-cli/pull/111)

## v1.3.5

### Fixes

> Fixed a bug encountered while installing the package via `npm`

## v1.3.3

### Fixes

> Minor tweaks

## v1.3.2

### Fixes

> Bugs fixed

## v1.3.1

### Fixes

> Minor bug fix

## v1.3.0

### Fixes

> This release beings about improvements to the code-base such as:-

- Use importstatement to include the required dependencies.
- Migrate from Jshint to eslint with babel and prettier presets.
- Minor changes to project structure
- Minor bug fixes

## v1.2.8

### Fixes

- [c5f17e7](https://github.com/madlabsinc/mevn-cli/commit/c5f17e796bd37c53c4be73eec9973cb837799ecb) - Fixed the bugs with validating `git` installation


## v1.2.7

### Fixes

> Prompts the user if the required dependencies to work with are not installed and proceeds with the installation as per choice.

### Commits

- [15e81c7](https://github.com/madlabsinc/mevn-cli/commit/15e81c70729943ea76c504e418c1dee342b8ba23) 
- [788709c](https://github.com/madlabsinc/mevn-cli/commit/788709c089415d259d6d9a69fdfdd8a4b6265fd1)
- [6ded326](https://github.com/madlabsinc/mevn-cli/commit/6ded326adb306b5c8bb6686deacacd914d3fb49f)

### v1.2.5

## Fixes

- [1978efd](https://github.com/madlabsinc/mevn-cli/commit/1978efd84ab4a1de8bfcc5b6ad8c0b19a4b78afc) - Fixed the bug encountered while serving the template.

## v1.2.3

### Fixes

- [dbdce46](https://github.com/madlabsinc/mevn-cli/commit/dbdce46b58e99abf2046cec88905c89e3cb8d8e8) - Fixed the bug while serving GraphQL template.

## v1.2.1

### Commits

- [2586204](https://github.com/madlabsinc/mevn-cli/commit/25862045f8956681bcf4d3e7661ef222007a243e)
- [0f378c0](https://github.com/madlabsinc/mevn-cli/commit/0f378c0a5347ac5c643df4fd14be03c0a6b50e84)
- [594e030](https://github.com/madlabsinc/mevn-cli/commit/594e030b017a04d18c2acf5a23342a40c3993138)

## v1.2.0

### Breaking Changes

- Change `mevn run:client/server` to `mevn serve`

### Commits

- [a633004](https://github.com/madlabsinc/mevn-cli/commit/a633004513021766bae8f4dbff81a674aaaff0c1)
- [44fc9e3](https://github.com/madlabsinc/mevn-cli/commit/44fc9e34075a363fc05a02753716e31e46ddce2e)

## v1.1.9

### Fixes

- [2c838dc](https://github.com/madlabsinc/mevn-cli/commit/2c838dc8d1b2be78bc76633ae3f93b97ff408a8a) - Shows up required warnings if mevn generate is used with graphql boilerplate

## v1.1.8

### Fixes

- [d01f6b2](https://github.com/madlabsinc/mevn-cli/commit/d01f6b21459de1ecc5ca5e7c3ec300318c4648d9) - Replaced create file commands with a generate command.
- [2e334d5](https://github.com/madlabsinc/mevn-cli/commit/2e334d59f110911f1dc15f66f13eea07f1360331) - Bump up to use cli-table3
- Docs related updates

## v1.1.5

### Fixes

- [#92](https://github.com/madlabsinc/mevn-cli/pull/92) - Validates docker installation locally
- [#93](https://github.com/madlabsinc/mevn-cli/pull/93) - Update file hierarchy within docs
- [#94](https://github.com/madlabsinc/mevn-cli/pull/94) - Validation for heroku-cli installation

## v1.1.0

### Changes

- [`0584d59`](https://github.com/madlabsinc/mevn-cli/commit/0584d59106333ad9ebffde2c9c3b972414d7b41e) Update demo within Docs

## v1.0.9

### Fixes

- Fixed a bug such that a directory having same name as the boilerplate already exists in path [#88](https://github.com/madlabsinc/mevn-cli/pull/88)

## v1.0.8

### Fixes

- Fix for [#86](https://github.com/madlabsinc/mevn-cli/pull/86) - now you can find `mevn.json` within the new project being created

## v1.0.5

### Fixes

- Fixed bug while fetching the Nuxt-js template
- Other minor bug fixes

## v1.0.1

### Fixes

- Core functionalities implemented.

## v0.0.2

### Fixes

- Bug fixes and code cleanup
- Update README.md
- Test vuepress for docs

## v0.0.1

### Initial release

- Includes basic functionalities.
