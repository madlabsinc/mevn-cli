'use strict';

import { run } from '../../jest/helpers';
import envinfo from 'envinfo';

describe('mevn info', () => {
  it('logs local environment information', async () => {
    const { stdout } = run(['info']);
    const data = await envinfo.run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmGlobalPackages: ['mevn-cli'],
    });
    expect(stdout).toContain(data);
  });
});
