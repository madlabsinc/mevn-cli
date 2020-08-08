'use strict';

import {
  run,
  runPromptWithAnswers,
  DOWN,
  ENTER,
  SPACE,
} from '../../jest/helpers';

import fs from 'fs';
import path from 'path';

// Create a temp directory
const tempDirPath = path.join(__dirname, 'init-cmd');
fs.mkdirSync(tempDirPath);

const genPath = path.join(tempDirPath, 'my-app');

describe('mevn init', () => {
  afterAll(() => {
    fs.rmdirSync(tempDirPath, { recursive: true });
  });

  it('shows an appropriate warning if multiple arguments were provided with init', () => {
    const { stdout } = run(['init', 'my-app', 'stray-arg']);
    expect(stdout).toContain(
      'Error: Kindly provide only one argument as the directory name!!',
    );
  });

  it('creates a new MEVN stack webapp with the Nuxt.js starter template', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js
        `${DOWN}${SPACE}${DOWN}${SPACE}${ENTER}`, // Opt for @nuxtjs/content and @nuxtjs/pwa modules
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    const clientPath = path.join(genPath, 'client');
    const serverPath = path.join(genPath, 'server');

    // nuxt.config.js
    const nuxtConfig = require(path.join(clientPath, 'nuxt.config.js')).default;

    // Check whether the respective entries have been updated
    expect(nuxtConfig.buildModules).toContain('@nuxtjs/pwa');
    expect(nuxtConfig.modules).toContain('@nuxt/content');
    expect(nuxtConfig.modules).not.toContain('@nuxtjs/axios');

    // Check for Nuxt.js modules config
    expect(nuxtConfig).not.toHaveProperty('axios');
    expect(nuxtConfig).toHaveProperty('content');

    // Check for rendering mode and deploy target config
    expect(nuxtConfig.mode).toBe('spa');
    expect(nuxtConfig.target).toBe('static');

    // .mevnrc
    const projectConfigContent = {
      name: 'my-app',
      template: 'Nuxt.js',
      modules: ['pwa', 'content'],
      deployTarget: 'static',
      isConfigured: false,
    };

    const projectConfig = JSON.parse(
      fs.readFileSync(path.join(genPath, '.mevnrc')),
    );
    expect(projectConfig).toStrictEqual(projectConfigContent);

    // Check for the existence of server directory
    expect(fs.existsSync(serverPath)).toBeTruthy();
  });

  it('shows an appropriate warning if the specified directory already exists in path', () => {
    const { stdout } = run(['init', 'my-app'], { cwd: tempDirPath });
    expect(stdout).toContain('Error: Directory my-app already exists in path!');
  });

  it('shows an appropriate warning if creating an application within a non-empty path', () => {
    const { stdout } = run(['init', '.'], { cwd: genPath });
    expect(stdout).toContain(`It seems the current directory isn't empty.`);
  });
});
