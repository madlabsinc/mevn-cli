import { ENTER } from 'cli-prompts-test';
import fs from 'fs';
import path from 'path';

import { copyDirSync, fetchProjectConfig, readFileContent } from '../helpers';
import { runPromptWithAnswers } from '../../../jest/helpers';

const srcPath = path.join(__dirname, 'test-dir');
const destPath = path.join(__dirname, 'dest-path');
const genPath = path.join(__dirname, 'my-app');

beforeAll(() => {
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath);
    fs.writeFileSync(path.join(srcPath, 'index.js'), '// Test');
  }
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath);
  }
});

afterAll(() => {
  // copyDirSync()
  fs.rmdirSync(srcPath, { recursive: true });
  fs.rmdirSync(destPath, { recursive: true });

  // fetchProjectConfig()
  fs.rmdirSync(genPath, { recursive: true });
});

test('copyDirSync()', () => {
  // Copy source directory to destination path
  copyDirSync(srcPath, destPath);

  // Assertions
  expect(fs.existsSync(path.join(destPath, 'test-dir'))).toBeTruthy();
  expect(
    fs.existsSync(path.join(destPath, 'test-dir', 'index.js')),
  ).toBeTruthy();
  expect(
    fs.readFileSync(path.join(destPath, 'test-dir', 'index.js'), 'utf8'),
  ).toBe('// Test');
});

test('fetchProjectConfig()', async () => {
  await runPromptWithAnswers(
    ['init', 'my-app'],
    [
      ENTER, // Choose Default as the starter template
      ENTER, // Requires server directory
    ],
    __dirname,
  );

  const projectConfig = {
    name: 'my-app',
    template: 'Default',
    isConfigured: {
      client: false,
      server: false,
    },
  };
  expect(fetchProjectConfig(genPath)).toEqual(projectConfig);
});

test('not passing in a path to fetchProjectConfig()', () => {
  expect(fetchProjectConfig()).toBe(undefined);
});

test('not passing in a file path to readFileContent()', () => {
  expect(readFileContent()).toBe(undefined);
});
