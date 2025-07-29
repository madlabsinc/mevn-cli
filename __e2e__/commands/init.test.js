import { run, runPromptWithAnswers } from '../../jest/helpers';
import { fetchProjectConfig } from '../../src/utils/helpers';

import { DOWN, ENTER } from 'cli-prompts-test';
import fs from 'fs';
import path from 'path';

// Utility for robust cleanup
const rmDirIfExists = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

describe('mevn init', () => {
  const tempDirPath = path.join(__dirname, 'init-cmd');
  const genPath = path.join(tempDirPath, 'my-app');
  const clientPath = path.join(genPath, 'client');
  const serverPath = path.join(genPath, 'server');

  // Cleanup and setup before all tests
  beforeAll(() => {
    rmDirIfExists(tempDirPath);
    fs.mkdirSync(tempDirPath);
  });

  // Final cleanup after all tests
  afterAll(() => rmDirIfExists(tempDirPath));

  // Extra per-test cleanup
  afterEach(() => {
    // Each test is responsible for its own output, but this catches anything left over.
    rmDirIfExists(genPath);
  });

  it('shows an appropriate warning if multiple arguments were provided with init', () => {
    const { exitCode, stderr } = run(['init', 'my-app', 'stray-arg'], {
      reject: false,
    });
    expect(exitCode).toBe(1);
    expect(stderr).toContain(
      'Error: Kindly provide only one argument as the directory name!!',
    );
  });

  it.skip('creates a new MEVN stack webapp based on the Nuxt.js starter template', async () => {
    rmDirIfExists(genPath);
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js as the starter template
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        ENTER, // Requires server directory
        ENTER, // Choose npm as the package manager
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
      deployTarget: 'static',
      isConfigured: { client: false, server: false },
      modules: [],
      name: 'my-app',
      packageManager: 'npm',
      renderingMode: 'spa',
      template: 'Nuxt.js',
    };
    expect(fetchProjectConfig(genPath)).toStrictEqual(projectConfigContent);

    // Check for the existence of server directory
    expect(fs.existsSync(serverPath)).toBeTruthy();
  });

  it('shows an appropriate warning if the specified directory already exists in path', () => {
    rmDirIfExists(genPath);
    fs.mkdirSync(genPath);

    const { exitCode, stderr } = run(['init', 'my-app'], {
      cwd: tempDirPath,
      reject: false,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Error: Directory my-app already exists in path!');
  });

  it('shows an appropriate warning if creating an application within a non-empty path', () => {
    rmDirIfExists(genPath);
    fs.mkdirSync(genPath); // create target directory

    // Add dummy file so it's not empty
    fs.writeFileSync(path.join(genPath, 'dummy.txt'), 'not empty');

    const { exitCode, stderr } = run(['init', '.'], {
      cwd: genPath,
      reject: false,
    });
    expect(exitCode).toBe(1);
    expect(stderr).toContain(`It seems the current directory isn't empty.`);
  });

  it.skip('creates a new MEVN stack webapp based on the GraphQL starter template', async () => {
    rmDirIfExists(genPath);
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${ENTER}`, // Choose GraphQL as the starter template
        ENTER, // Requires server directory
        ENTER, // Choose npm as the package manager
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
  });

  it.skip('creates a new MEVN stack webapp based on the PWA starter template', async () => {
    rmDirIfExists(genPath);
    const { exitCode } = await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${ENTER}`, // Choose PWA as the starter template
        ENTER, // Requires server directory
        ENTER, // Choose npm as the package manager
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
  });

  it.skip('creates a new MEVN stack webapp based on the Default starter template in current directory', async () => {
    rmDirIfExists(genPath);
    fs.mkdirSync(genPath);

    const { exitCode } = await runPromptWithAnswers(
      ['init', '.'],
      [
        ENTER, // Choose Default as the starter template
        ENTER, // Requires server directory
        ENTER, // Choose npm as the package manager
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
    expect(fs.existsSync(serverPath)).toBeTruthy();
  });
});
