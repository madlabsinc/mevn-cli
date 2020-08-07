import { runPromptWithAnswers, DOWN, ENTER, SPACE } from '../../jest/helpers';

import fs from 'fs';
import path from 'path';

// Create a temp directory
const tempDirPath = path.join(__dirname, 'add-cmd');
fs.mkdirSync(tempDirPath);

const genPath = path.join(tempDirPath, 'my-app');

describe('mevn add', () => {
  afterAll(() => {
    fs.rmdirSync(tempDirPath, { recursive: true });
  });

  it('installs Nuxt.js modules if no args were passed in', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js
        `${SPACE}${ENTER}`, // Opt for @nuxtjs/axios module
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        `N${ENTER}`, // Not a fullstack app
      ],
      tempDirPath,
    );

    // Invoke the add command
    await runPromptWithAnswers(
      ['add'],
      [`${DOWN}${SPACE}${DOWN}${DOWN}${SPACE}${ENTER}`], // Choose @nuxtjs/pwa modules and the vuex addon
      genPath,
    );
    const clientPath = path.join(genPath, 'client');

    // nuxt.config.js
    const nuxtConfig = require(path.join(clientPath, 'nuxt.config.js')).default;
    expect(nuxtConfig.buildModules).toContain('@nuxtjs/pwa');
    expect(nuxtConfig.modules).toContain('@nuxtjs/axios');

    // .mevnrc
    const projectConfig = JSON.parse(
      fs.readFileSync(path.join(genPath, '.mevnrc')),
    );
    expect(projectConfig.modules).toContain('pwa');
    expect(projectConfig.modules).toContain('vuex');
    expect(projectConfig.modules).toContain('axios');

    // package.json
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(clientPath, 'package.json')),
    );
    expect(pkgJson.devDependencies['@nuxtjs/pwa']).toBeTruthy();

    // @nuxtjs/axios should be installed via mevn serve since it was opted at first
    expect(pkgJson.devDependencies['@nuxtjs/axios']).not.toBeTruthy();

    // vuex-store
    expect(
      fs.readFileSync(path.join(clientPath, 'store', 'index.js')),
    ).toBeTruthy();
  });
});
