'use strict';

import { run } from '../jest/helpers';

describe('Default behavior', () => {
  it('warns the user on passing in an unknown option', () => {
    const { stderr } = run(['--invalid'], { reject: false });
    expect(stderr).toContain(`error: unknown option`);
  });

  it('warns the user if an unknown command is passed', () => {
    const { stdout } = run(['junkcmd']);
    expect(stdout).toContain('Unknown command');
  });

  it('suggests the closest match for an unknown command', () => {
    const { stdout } = run(['ini']);
    expect(stdout).toContain('Did you mean');
  });
});
