import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

/**
 *  Convert into async variants
 */

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Copy files
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */

const copyFileSync = (source, target) => {
  let targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

/**
 * Copy directory content recursively
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */
const copyDirSync = (source, target) => {
  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    fs.readdirSync(source).forEach(function(file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyDirSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};

module.exports = { copyDirSync, readFileAsync, writeFileAsync };
