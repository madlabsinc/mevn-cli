import { runPromptWithAnswers, rmTempDir } from '../../jest/helpers';
import { fetchProjectConfig } from '../../src/utils/helpers';

import { DOWN, ENTER } from 'cli-prompts-test';
import fs from 'fs';
import path from 'path';

describe('mevn generate', () => {
  const tempDirPath = path.join(__dirname, 'generate-cmd');
  const genPath = path.join(tempDirPath, 'my-app');

  // The client directory
  const clientPath = path.join(genPath, 'client');
  const uiComponentPath = path.join(clientPath, 'src', 'components');
  const pageComponentPath = path.join(clientPath, 'src', 'views');

  // The server directory
  const serverPath = path.join(genPath, 'server');

  // Cleanup
  beforeAll(() => {
    rmTempDir(tempDirPath);
    fs.mkdirSync(tempDirPath);
  });

  afterAll(() => rmTempDir(tempDirPath));

  it('generates a UI component', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        ENTER, // Choose Default as the starter template
        `Y${ENTER}`, // Requires server directory
        ENTER, // Choose npm as the package manager
      ],
      tempDirPath,
    );

    expect(fetchProjectConfig(genPath).isConfigured.client).toBe(false);

    // Invoke generate command
    const { exitCode } = await runPromptWithAnswers(
      ['generate'],
      [
        ENTER, // Generate new component
        `navbar${ENTER}`, // Navbar.vue (name)
        ENTER, // Choose UI component
      ],
      genPath,
    );

    expect(exitCode).toBe(0);

    // Invoking the generate command updates the key
    expect(fetchProjectConfig(genPath).isConfigured.client).toBe(true);

    // Check whether Navbar.vue is created within the respective path
    expect(
      fs.existsSync(path.join(uiComponentPath, 'Navbar.vue')),
    ).toBeTruthy();
  });

  it('generates a Page component', async () => {
    const { exitCode } = await runPromptWithAnswers(
      ['generate'],
      [
        ENTER, // Generate new component
        `dashboard${ENTER}`, // Dashboard.vue (name)
        `${DOWN}${ENTER}`, // Choose Page component
      ],
      genPath,
    );

    expect(exitCode).toBe(0);

    // Check whether Dashboard.vue is created within the respective path
    expect(
      fs.existsSync(path.join(pageComponentPath, 'Dashboard.vue')),
    ).toBeTruthy();

    // router.js
    const routerConfig = fs
      .readFileSync(path.join(clientPath, 'src', 'router.js'), 'utf8')
      .split('\n');

    // Check whether a new entry is added to the route-config
    expect(
      routerConfig.some((config) => config.trim() === `path:"/dashboard",`),
    );
  });

  it('generates CRUD Boilerplate within the server directory', async () => {
    const { exitCode } = await runPromptWithAnswers(
      ['generate'],
      [
        `${DOWN}${ENTER}`, // Choose CRUD Boilerplate
        ENTER, // Default value for MongoDB URI
      ],
      genPath,
    );

    expect(exitCode).toBe(0);

    // .mevnrc
    expect(fetchProjectConfig(genPath).isConfigured.server).toBe(true);

    // Assert for generated files
    const generatedFiles = [
      'controllers/user_controller.js',
      'models/user_schema.js',
      'helpers/db/mongodb.js',
      '.env',
    ];
    generatedFiles.forEach((file) => {
      expect(fs.existsSync(path.join(serverPath, file))).toBeTruthy();
    });

    // MongoDB URI path within .env
    const envDotFile = fs.readFileSync(path.join(serverPath, '.env'), 'utf8');
    expect(envDotFile).toBe('DB_URL=mongodb://localhost:27017/userdb');
  });
});
