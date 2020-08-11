'use strict';

import {
  run,
  rmTempDir,
  runPromptWithAnswers,
  fetchProjectConfig,
  DOWN,
  ENTER,
} from '../../jest/helpers';

import fs from 'fs';
import path from 'path';

// Create a temp directory
const tempDirPath = path.join(__dirname, 'init-cmd');
fs.mkdirSync(tempDirPath);

const genPath = path.join(tempDirPath, 'my-app');

const clientPath = path.join(genPath, 'client');
const serverPath = path.join(genPath, 'server');

describe('mevn init', () => {
  afterAll(() => rmTempDir(tempDirPath));

  it('shows an appropriate warning if multiple arguments were provided with init', () => {
    const { stdout } = run(['init', 'my-app', 'stray-arg']);
    expect(stdout).toContain(
      'Error: Kindly provide only one argument as the directory name!!',
    );
  });

  it('creates a new MEVN stack webapp based on the Nuxt.js starter template', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js as the starter template
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    // nuxt.config.js
    const nuxtConfig = require(path.join(clientPath, 'nuxt.config.js')).default;

    // Check for rendering mode and deploy target config
    expect(nuxtConfig.mode).toBe('spa');
    expect(nuxtConfig.target).toBe('static');

    // .mevnrc
    const projectConfigContent = {
      name: 'my-app',
      renderingMode: 'spa',
      template: 'Nuxt.js',
      modules: [],
      deployTarget: 'static',
      isConfigured: {
        client: false,
        server: false,
      },
    };
    expect(fetchProjectConfig(genPath)).toStrictEqual(projectConfigContent);

    // Check for the existence of server directory
    expect(fs.existsSync(serverPath)).toBeTruthy();
  });

  it('shows an appropriate warning if the specified directory already exists in path', () => {
    const { stdout } = run(['init', 'my-app'], { cwd: tempDirPath });
    expect(stdout).toContain('Error: Directory my-app already exists in path!');
  });

  it('shows an appropriate warning if creating an application within a non-empty path', () => {
    const { stdout } = run(['init', '.'], {
      cwd: genPath,
      reject: false,
    });
    expect(stdout).toContain(`It seems the current directory isn't empty.`);

    // Delete the generated directory
    rmTempDir(genPath);
  });

  it('creates a new MEVN stack webapp based on the GraphQL starter template', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${ENTER}`, // Choose GraphQL as the starter template
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    expect(fetchProjectConfig(genPath).template).toBe('GraphQL');

    // Rename .mevngitignore to .gitignore
    expect(fs.existsSync(path.join(clientPath, '.mevngitignore'))).toBeFalsy();
    expect(fs.existsSync(path.join(clientPath, '.gitignore'))).toBeTruthy();

    // Check whether if the respective directory have been generated
    expect(fs.existsSync(path.join(serverPath, 'graphql'))).toBeTruthy();
  });
});
