'user strict';

import ora from 'ora';

export class Spinner {
  constructor(text) {
    this.text = text;
  }

  start() {
    this.spinner = ora(this.text).start();
  }

  stop() {
    this.spinner.stop();
  }
}
