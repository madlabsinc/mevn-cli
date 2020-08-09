'use strict';

import 'babel-polyfill';
import concat from 'concat-stream';
import execa from 'execa';
import fs from 'fs';
import path from 'path';

const CLI_PATH = path.resolve('bin', 'mevn.js');

// sync version
export const run = (args, options = {}) => execa.sync(CLI_PATH, args, options);

// Test cases that require simulating user input
export const runPromptWithAnswers = (args, answers, testPath) => {
  args = [CLI_PATH].concat(args);

  const process = execa('node', args, { cwd: testPath });
  process.stdin.setEncoding('utf-8');

  const writeToStdin = (answers) => {
    if (answers.length > 0) {
      setTimeout(() => {
        process.stdin.write(answers[0]);
        writeToStdin(answers.slice(1));
      }, 3000);
    } else {
      process.stdin.end();
    }
  };

  // Simulate user input
  writeToStdin(answers);

  return new Promise((resolve) => {
    process.stdout.pipe(
      concat((result) => {
        resolve(result.toString());
      }),
    );
  });
};

// async version
export const runAsync = async (args, options = {}) =>
  await execa(CLI_PATH, args, options);

// Cleanup
export const rmTempDir = (tempDirPath) =>
  fs.rmdirSync(tempDirPath, { recursive: true });

// Espace sequence
export const DOWN = '\x1B\x5B\x42';
export const ENTER = '\x0D';
export const SPACE = '\x20';
