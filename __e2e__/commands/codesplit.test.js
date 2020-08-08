import {
  run,
  runPromptWithAnswers,
  rmTempDir,
  DOWN,
  ENTER,
} from '../../jest/helpers';

import fs from 'fs';
import path from 'path';

// Create a temp directory
const tempDirPath = path.join(__dirname, 'codesplit-cmd');
fs.mkdirSync(tempDirPath);

const genPath = path.join(tempDirPath, 'my-app');

// The client directory
const clientPath = path.join(genPath, 'client');

describe('mevn codesplit', () => {
  afterAll(() => rmTempDir(tempDirPath));

  it('dynamically imports a component', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        ENTER, // Choose basic template
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    // Invoke generate command
    await runPromptWithAnswers(
      ['generate'],
      [
        ENTER, // Generate new component
        `dashboard${ENTER}`, // Dashboard.vue (name)
        `${DOWN}${ENTER}`, // Choose Page component
      ],
      genPath,
    );

    // Invoke codesplit command
    await runPromptWithAnswers(['codesplit'], [`${DOWN}${ENTER}`], genPath);

    // router.js
    const routerConfig = fs
      .readFileSync(path.join(clientPath, 'src', 'router.js'), 'utf8')
      .split('\n');
    expect(
      routerConfig.some(
        (config) =>
          config.trim() === `component: () => import("./views/Dashboard.vue")`,
      ),
    ).toBeTruthy();

    // Delete generated directory
    rmTempDir(genPath);
  });

  it('shows an appropriate warning for Nuxt.js starter template', async () => {
    await runPromptWithAnswers(
      ['init', 'my-app'],
      [
        `${DOWN}${DOWN}${DOWN}${ENTER}`, // Choose Nuxt.js
        ENTER, // Nuxt.js modules aren't required
        `${DOWN}${ENTER}`, // Choose spa as the rendering mode
        `${DOWN}${ENTER}`, // Choose static as the deploy target
        `Y${ENTER}`, // Requires server directory
      ],
      tempDirPath,
    );

    // Invoke codesplit command
    const { stdout } = run(['codesplit'], { cwd: genPath });
    expect(stdout).toContain(`You're having the Nuxt.js boilerplate template`);
  });
});
