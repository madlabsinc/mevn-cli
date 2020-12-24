'use strict';

import { run } from '../jest/helpers';

describe('Default behavior', () => {
  it('warns the user if an unknown option is passed in', () => {
    const { exitCode, stderr } = run(['--invalid'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr).toBe(`error: unknown option '--invalid'`);
  });

  it('warns the user if an unknown command is passed in', () => {
    const { exitCode, stderr } = run(['create'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr.trim()).toBe('Unknown command create.');
  });

  it('suggests the closest match for an unknown command', () => {
    const { exitCode, stderr } = run(['ini'], { reject: false });
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Did you mean init?');
  });
});
