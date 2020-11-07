'use strict';

import {
  run,
  rmTempDir,
  runPromptWithAnswers,
  fetchProjectConfig,
} from '../../jest/helpers';

import { DOWN, ENTER } from 'cli-prompts-test';
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
        ENTER, // Choose Express.js
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

  it('creates webapp based on the Default starter template with Hapi server template', async () => {
    const appGenPath = path.join(tempDirPath, 'default-hapi');
    await runPromptWithAnswers(
      ['init', 'default-hapi'],
      [
        ENTER, // Choose Default as the starter template
        `Y${ENTER}`, // Requires server directory
        `${DOWN}${ENTER}`, // Choose Hapi.js as server template
      ],
      tempDirPath,
    );
    // Check Hapi dependencies in package.json
    const appServerPath = path.join(appGenPath, 'server');
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(appServerPath, 'package.json')),
    );
    expect(pkgJson.dependencies['@hapi/hapi']).toBeTruthy();
  });

  it('creates a new MEVN stack webapp based on the Default starter template with Express server template', async () => {
    const appGenPath = path.join(tempDirPath, 'default-express');
    await runPromptWithAnswers(
      ['init', 'default-express'],
      [
        ENTER, // Choose Default as the starter template
        `Y${ENTER}`, // Requires server directory
        ENTER, // Choose Express.js as server template
      ],
      tempDirPath,
    );
    // Check Express dependencies in package.json
    const appServerPath = path.join(appGenPath, 'server');
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(appServerPath, 'package.json')),
    );
    expect(pkgJson.dependencies['express']).toBeTruthy();
  });

  it('creates webapp based on the Default starter template with no server template', async () => {
    const appGenPath = path.join(tempDirPath, 'default-no-server');
    await runPromptWithAnswers(
      ['init', 'default-no-server'],
      [
        ENTER, // Choose Default as the starter template
        `N${ENTER}`, // Server is not required
      ],
      tempDirPath,
    );
    // project config for server should be undefiend
    expect(fetchProjectConfig(appGenPath).isConfigured.server).toBe(undefined);
    expect(fetchProjectConfig(appGenPath).isConfigured.client).toBe(false);
  });
});
