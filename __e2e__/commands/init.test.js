'use strict';

import { run, rmTempDir, runPromptWithAnswers } from '../../jest/helpers';
import { fetchProjectConfig } from '../../src/utils/helpers';

import { DOWN, ENTER } from 'cli-prompts-test';
import fs from 'fs';
import path from 'path';

describe('mevn init', () => {
  const tempDirPath = path.join(__dirname, 'init-cmd');
  const genPath = path.join(tempDirPath, 'my-app');

  const clientPath = path.join(genPath, 'client');
  const serverPath = path.join(genPath, 'server');

  // Cleanup
  beforeAll(() => {
    rmTempDir(tempDirPath);
    fs.mkdirSync(tempDirPath);
  });

  afterAll(() => rmTempDir(tempDirPath));

  it('shows an appropriate warning if multiple arguments were provided with init', () => {
    const { exitCode, stderr } = run(['init', 'my-app', 'stray-arg'], {
      reject: false,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain(
      'Error: Kindly provide only one argument as the directory name!!',
    );
  });

  it('creates a new MEVN stack webapp based on the Nuxt.js starter template', async () => {
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js as the starter template
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        `${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    expect(exitCode).toBe(0);

    // nuxt.config.js
    const nuxtConfig = require(path.join(clientPath, 'nuxt.config.js')).default;

    // Check for rendering mode and deploy target config
    expect(nuxtConfig.ssr).toBe(false);
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
    const { exitCode, stderr } = run(['init', 'my-app'], {
      cwd: tempDirPath,
      reject: false,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Error: Directory my-app already exists in path!');
  });

  it('shows an appropriate warning if creating an application within a non-empty path', () => {
    const { exitCode, stderr } = run(['init', '.'], {
      cwd: genPath,
      reject: false,
    });
    expect(exitCode).toBe(1);
    expect(stderr).toContain(`It seems the current directory isn't empty.`);

    // Delete the generated directory
    rmTempDir(genPath);
  });

  it('creates a new MEVN stack webapp based on the GraphQL starter template', async () => {
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${ENTER}`, // Choose GraphQL as the starter template
        `${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    expect(exitCode).toBe(0);
    expect(fetchProjectConfig(genPath).template).toBe('GraphQL');
    expect(fetchProjectConfig(genPath).isConfigured.client).toBe(false);
    expect(fetchProjectConfig(genPath).isConfigured.server).toBe(false);

    // Rename .mevngitignore to .gitignore
    expect(fs.existsSync(path.join(clientPath, '.mevngitignore'))).toBeFalsy();
    expect(fs.existsSync(path.join(clientPath, '.gitignore'))).toBeTruthy();

    // Check whether if the respective directory have been generated
    expect(fs.existsSync(path.join(serverPath, 'graphql'))).toBeTruthy();

    // Delete the generated directory
    rmTempDir(genPath);
  });

  it('creates a new MEVN stack webapp based on the PWA starter template', async () => {
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${ENTER}`, // Choose PWA as the starter template
        `${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    expect(exitCode).toBe(0);
    expect(fetchProjectConfig(genPath).template).toBe('PWA');
    expect(fetchProjectConfig(genPath).isConfigured.client).toBe(false);
    expect(fetchProjectConfig(genPath).isConfigured.server).toBe(false);

    // Rename .mevngitignore to .gitignore
    expect(fs.existsSync(path.join(clientPath, '.mevngitignore'))).toBeFalsy();
    expect(fs.existsSync(path.join(clientPath, '.gitignore'))).toBeTruthy();

    // Check whether if the respective directory have been generated
    expect(fs.existsSync(path.join(serverPath))).toBeTruthy();

    // Assert for files specific to the starter template
    expect(fs.existsSync(path.join(clientPath, 'public', 'img'))).toBeTruthy();
    expect(
      fs.existsSync(path.join(clientPath, 'public', 'manifest.json')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(clientPath, 'src', 'registerServiceWorker.js')),
    ).toBeTruthy();

    // Delete the generated directory
    rmTempDir(genPath);
  });

  it('creates a new MEVN stack webapp based on the Default starter template in current directory', async () => {
    // Create my-app directory
    fs.mkdirSync(genPath);

    const { exitCode } = await runPromptWithAnswers(
      ['init', '.'],
      [
        ENTER, // Choose Default as the starter template
        ENTER, // Requires server directory
      ],
      genPath,
    );

    expect(exitCode).toBe(0);
    expect(fetchProjectConfig(genPath).template).toBe('Default');
    expect(fetchProjectConfig(genPath).isConfigured.client).toBe(false);
    expect(fetchProjectConfig(genPath).isConfigured.server).toBe(false);

    // Rename .mevngitignore to .gitignore
    expect(fs.existsSync(path.join(clientPath, '.mevngitignore'))).toBeFalsy();
    expect(fs.existsSync(path.join(clientPath, '.gitignore'))).toBeTruthy();

    // Check whether if the respective directory have been generated
    expect(fs.existsSync(path.join(serverPath))).toBeTruthy();
  });
});
