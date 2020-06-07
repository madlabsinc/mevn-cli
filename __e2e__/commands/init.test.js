'use strict';

import fs from 'fs';

import { run } from '../../jest/helpers';

const genPath = `${__dirname}/my-app`;

describe('mevn init', () => {
  beforeEach(() => {
    fs.mkdirSync(genPath);
    fs.writeFileSync(`${genPath}/index.js`, '// Test');
  });

  afterEach(() => {
    fs.rmdirSync(genPath, { recursive: true });
  });

  it('shows an appropriate warning if the specified directory already exists in path', () => {
    const { stdout } = run(['init', 'my-app'], { cwd: __dirname });
    expect(stdout).toContain('Error: Directory my-app already exists in path!');
  });

  it('shows an appropriate warning if multiple arguments were provided with init', () => {
    const { stdout } = run(['init', 'my-app', 'stray-arg']);
    expect(stdout).toContain(
      'Error: Kindly provide only one argument as the directory name!!',
    );
  });

  it('shows an appropriate warning if creating an application within a non-empty path', () => {
    const { stdout } = run(['init', '.'], { cwd: genPath });
    expect(stdout).toContain(`It seems the current directory isn't empty.`);
  });
});
