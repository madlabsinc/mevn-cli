import execa from 'execa';
import path from 'path';

const CLI_PATH = path.resolve(process.cwd(), 'bin', 'mevn.js');

// Generic tests

test('shows up help if no arguments were passed', () => {
  const { stdout } = execa.sync(CLI_PATH);
  expect(stdout).toMatchSnapshot();
});

test('show up help information on passing in the respective options', () => {
  ['-h', '--help'].forEach(op => {
    let { stdout } = execa.sync(CLI_PATH, [op]);
    expect(stdout).toMatchSnapshot();
  });
});

test('show up CLI version information', () => {
  ['-V', '--version'].forEach(op => {
    let { stdout } = execa.sync(CLI_PATH, [op]);
    expect(stdout).toMatchSnapshot();
  });
});

test('warns on passing in unknown option', () => {
  try {
    const { stderr } = execa.sync(CLI_PATH, ['--invalid']);
    expect(stderr).toContain('Unknown option');
    } catch (err) {
    // handle err
    }
});
