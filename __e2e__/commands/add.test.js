import { runPromptWithAnswers, rmTempDir } from '../../jest/helpers';

import { DOWN, ENTER, SPACE } from 'cli-prompts-test';
import fs from 'fs';
import path from 'path';

describe('mevn add', () => {
  const tempDirPath = path.join(__dirname, 'add-cmd');
  const genPath = path.join(tempDirPath, 'my-app');

  // The client directory
  const clientPath = path.join(genPath, 'client');

  // The server directory
  const serverPath = path.join(genPath, 'server');

  // Cleanup
  beforeAll(() => {
    rmTempDir(tempDirPath);
    fs.mkdirSync(tempDirPath);
  });

  afterAll(() => rmTempDir(tempDirPath));

  it('installs Nuxt.js modules if no args were passed in', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js
        ENTER, // Choose universal as the rendering mode
        ENTER, // Choose server as the deploy target
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    // Invoke the add command
    await runPromptWithAnswers(
      ['add'],
      [
        ENTER,
        `${DOWN}${SPACE}${DOWN}${DOWN}${DOWN}${DOWN}${SPACE}${DOWN}${DOWN}${DOWN}${DOWN}${SPACE}${ENTER}`,
      ], // Choose @nuxtjs/pwa, nuxt-oauth and @nuxtjs/storybook modules
      genPath,
    );

    // nuxt.config.js
    const nuxtConfig = require(path.join(clientPath, 'nuxt.config.js')).default;
    expect(nuxtConfig.buildModules).toContain('@nuxtjs/pwa');
    expect(nuxtConfig.modules).toContain('nuxt-oauth');
    expect(nuxtConfig.buildModules).not.toContain('@nuxtjs/storybook');

    // .mevnrc
    const projectConfig = JSON.parse(
      fs.readFileSync(path.join(genPath, '.mevnrc')),
    );
    ['pwa', 'oauth', 'storybook', 'vuex'].forEach((module) =>
      expect(projectConfig.modules).toContain(module),
    );
    expect(projectConfig.isConfigured['client']).toBe(true);

    // package.json
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(clientPath, 'package.json')),
    );
    expect(pkgJson.dependencies['nuxt-oauth']).toBeTruthy();
    expect(pkgJson.devDependencies['@nuxtjs/pwa']).toBeTruthy();
    expect(pkgJson.devDependencies['@nuxtjs/storybook']).toBeTruthy();

    const gitIgnoreContent = fs
      .readFileSync(path.join(clientPath, '.gitignore'), 'utf8')
      .split('\n');
    expect(gitIgnoreContent.includes('.nuxt-storybook')).toBeTruthy();
    expect(gitIgnoreContent.includes('storybook-static')).toBeTruthy();

    const nuxtIgnoreContent = fs
      .readFileSync(path.join(clientPath, '.nuxtignore'), 'utf8')
      .split('\n');
    expect(nuxtIgnoreContent.includes('**/*.stories.js')).toBeTruthy();

    // vuex-store is activated via nuxt-oauth
    expect(
      fs.readFileSync(path.join(clientPath, 'store', 'index.js')),
    ).toBeTruthy();
  });

  it('installs the respective dependency passed as an arg', async () => {
    await runPromptWithAnswers(['add', 'v-tooltip'], [ENTER], genPath);

    // package.json
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(clientPath, 'package.json')),
    );
    expect(pkgJson.dependencies['v-tooltip']).toBeTruthy();
  });

  it('installs the respective devDependency passed as an arg for the server directory', async () => {
    await runPromptWithAnswers(
      ['add', 'husky', '--dev'],
      [`${DOWN}${ENTER}`],
      genPath,
    );

    // package.json
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(serverPath, 'package.json')),
    );
    expect(pkgJson.devDependencies['husky']).toBeTruthy();
  });

  it('shows a warning if no args were passed in for server directory', async () => {
    const { stdout } = await runPromptWithAnswers(
      ['add'],
      [`${DOWN}${ENTER}`], // opts for server directory
      genPath,
    );
    expect(stdout).toContain('Please specify the dependencies to install');

    // Delete generated directory
    rmTempDir(genPath);
  });

  it('shows a warning if no args were passed in for a starter template other than Nuxt.js', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        ENTER, // Choose Default as the starter template
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    // Invoke the add command
    const { stdout } = await runPromptWithAnswers(
      ['add'],
      [ENTER], // opts for client directory
      genPath,
    );
    expect(stdout).toContain('Please specify the dependencies to install');
  });
});
