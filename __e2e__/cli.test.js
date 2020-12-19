'use strict';

import { run } from '../jest/helpers';

describe('Default behavior', () => {
  it('warns the user if an unknown option is passed in', () => {
    const { exitCode, stderr } = run(['--invalid'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr).toContain(`error: unknown option`);
  });

  it('warns the user if an unknown command is passed in', () => {
    const { exitCode, stderr } = run(['create'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Unknown command create');
  });

  it('suggests the closest match for an unknown command', () => {
    const { exitCode, stdout } = run(['ini'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stdout).toContain('Did you mean init?');
  });
});
