import execa from 'execa';
import Spinner from './spinner';

/**
 * Execute shell commands
 * @param {String} cmd - Command to be executed
 * @param {String} progressMsg - Suitable message to show up with the spinner during execution
 * @param {String} successMsg - Suitable message to show up with the spinner on successful completion
 * @param {Object} options - Optional argument to configure execa
 *
 * @returns {Promise<void>}
 */

export default async (cmd, progressMsg, successMsg = 'Done', options = {}) => {
  const spinner = new Spinner(progressMsg);
  spinner.start();
  try {
    await execa.shell(cmd, options);
    spinner.succeed(successMsg);
  } catch (err) {
    spinner.fail('Something went wrong');
    throw err;
  }
};
