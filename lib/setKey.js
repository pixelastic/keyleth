import { _ } from 'golgoth';
import { absolute, exists, gitRoot, read, write } from 'firost';

export let __;
/**
 * Sets a key-value pair in a .env file
 * @param {string} key - The environment variable key
 * @param {string} value - The value to set
 * @param {object} userOptions - Options object with optional cwd property
 */
export async function setKey(key, value, userOptions = {}) {
  const options = {
    cwd: __.gitRoot(),
    ...userOptions,
  };

  const filepath = absolute(`${options.cwd}/.env`);
  const content = (await exists(filepath)) ? await read(filepath) : '';
  const newContent = __.updateContent(content, key, value);
  await write(newContent, filepath);
}

__ = {
  /**
   * Updates or adds a key-value pair in content formatted as key="value" lines
   * @param {string} content - The content string containing key-value pairs separated by newlines
   * @param {string} key - The key to update or add
   * @param {string} value - The value to assign to the key
   * @returns {string} The updated content string with the key-value pair modified or added
   */
  updateContent(content, key, value) {
    const newLine = `${key}="${value}"`;

    if (!content) {
      return newLine;
    }

    return _.chain(content)
      .split('\n')
      .reduce((result, line) => {
        // Line to replace
        if (_.startsWith(line, `${key}=`)) {
          result.push(newLine);
          return result;
        }

        result.push(line);
        return result;
      }, [])
      .join('\n')
      .value();
  },
  gitRoot,
};
