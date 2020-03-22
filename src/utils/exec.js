import execa from 'execa';

/**
 * Execute shell commands
 * @param {String} cmd - Command to be executed
 * @param {Spinner} spinner - Spinner instance
 * @param {String} successMsg - Suitable message to show up with the spinner on successful completion
 *
 * @returns {Promise<void>}
 */

export default async (cmd, spinner, successMsg) => {
  try {
    await execa.shell(cmd);
    spinner.succeed(successMsg);
  } catch (err) {
    spinner.fail('Something went wrong');
    throw err;
  }
};
