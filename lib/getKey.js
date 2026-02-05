import { _ } from 'golgoth';
import { absolute, exists, gitRoot, read } from 'firost';

export let __;

/**
 * Retrieves a specific key value from a .env file
 * @param {string} key - The environment variable key to retrieve
 * @param {object} [userOptions={}] - Configuration options
 * @param {string} [userOptions.cwd] - The current working directory to search for .env file
 * @returns {string | null} The value of the specified key, or null if not found or file doesn't exist
 */
export async function getKey(key, userOptions = {}) {
  const options = {
    cwd: __.gitRoot(),
    ...userOptions,
  };

  const filepath = absolute(`${options.cwd}/.env`);
  if (!(await exists(filepath))) {
    return null;
  }

  const content = await read(filepath);
  return __.getKeyFromContent(content, key);
}

__ = {
  /**
   * Extracts the value for a specified key from content formatted as key-value pairs.
   * @param {string} content - The content to search through, with key-value pairs separated by newlines
   * @param {string} key - The key to search for
   * @returns {string|null} The value associated with the key, or null if not found or content is empty
   */
  getKeyFromContent(content, key) {
    if (!content) {
      return null;
    }

    return _.chain(content)
      .split('\n')
      .find((line) => {
        return _.startsWith(line, `${key}=`);
      })
      .split('=')
      .drop()
      .join('=')
      .trim('"')
      .thru((value) => (value === '' ? null : value))
      .value();
  },
  gitRoot,
};
