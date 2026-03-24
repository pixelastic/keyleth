import { _ } from 'golgoth';
import { absolute, exists, gitRoot, read } from 'firost';

export let __;

/**
 * Retrieves a specific key value from a .env file
 * @param {string} key - The environment variable key to retrieve
 * @param {string|object} [fallbackOrOptions] - Either a fallback string value or configuration options
 * @param {object} [userOptions={}] - Configuration options (if fallbackOrOptions is a string)
 * @param {string} [userOptions.cwd] - The current working directory to search for .env file
 * @returns {string | null} The value of the specified key, fallback value, or null if not found
 */
export async function getKey(key, fallbackOrOptions = null, userOptions = {}) {
  let fallback = fallbackOrOptions;
  let options = userOptions;

  if (_.isObject(fallbackOrOptions)) {
    fallback = null;
    options = fallbackOrOptions;
  }

  options = {
    cwd: __.gitRoot(),
    ...options,
  };

  const filepath = absolute(`${options.cwd}/.env`);
  if (!(await exists(filepath))) {
    return fallback;
  }

  const content = await read(filepath);
  const value = __.getKeyFromContent(content, key);

  return value !== null ? value : fallback;
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
