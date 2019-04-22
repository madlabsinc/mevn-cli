'user strict';

import ora from 'ora';

export default class Spinner {
  constructor(text) {
    this.text = text;
  }

  start() {
    this.spinner = ora(this.text).start();
  }

  info(text) {
    this.spinner.info(text);
  }

  succeed(text) {
    this.spinner.succeed(text);
  }

  fail(text) {
    this.spinner.fail(text);
  }

  stop() {
    this.spinner.stop();
  }
}
