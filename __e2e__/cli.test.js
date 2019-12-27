'use strict';

import { run } from '../jest/helpers';
// Generic tests

test('shows up help if no arguments were passed', () => {
  const { stdout } = run();
  expect(stdout).toMatchSnapshot();
});

test('show up help information on passing in the respective options', () => {
  ['-h', '--help'].forEach(op => {
    const { stdout } = run([op]);
    expect(stdout).toMatchSnapshot();
  });
});

test('show up CLI version information', () => {
  ['-V', '--version'].forEach(op => {
    const { stdout } = run([op]);
    expect(stdout).toMatchSnapshot();
  });
});

test('warns the user on passing in unknown option', () => {
  try {
    const { stderr } = run(['--invalid']);
    expect(stderr).to.be(`error: unknown option '--invalid'`);
  } catch (err) {
    // handle err
  }
});

// A bit specific

test('warns the user if an unknown command is passed', () => {
  const { stdout } = run(['junkcmd']);
  expect(stdout).toMatchSnapshot();
});

test('suggests the matching command if the user makes a typo', () => {
  const { stdout } = run(['ini']);
  expect(stdout).toMatchSnapshot();
});
