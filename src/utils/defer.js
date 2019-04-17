'use strict';

exports.deferExec = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
