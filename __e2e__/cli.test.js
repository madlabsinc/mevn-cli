'use strict';

import { run } from '../jest/helpers';

describe('Default behavior', () => {
  it('warns the user if an unknown option is passed in', () => {
    const { stderr, exitCode } = run(['--invalid'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr).toContain(`error: unknown option`);
  });

  it('warns the user if an unknown command is passed in', () => {
    const { stdout } = run(['create']);
    expect(stdout).toContain('Unknown command create');
  });

  it('suggests the closest match for an unknown command', () => {
    const { stdout } = run(['ini']);
    expect(stdout).toContain('Did you mean init?');
  });
});
