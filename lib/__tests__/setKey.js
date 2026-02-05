import { read, remove, tmpDirectory, write } from 'firost';
import { __, setKey } from '../setKey.js';

describe('setKey', () => {
  describe('setKey()', () => {
    const testDirectory = tmpDirectory('keyleth/setKey');
    beforeEach(async () => {
      vi.spyOn(__, 'gitRoot').mockReturnValue(testDirectory);
    });
    afterEach(async () => {
      await remove(testDirectory);
    });

    it('should write a new file if file does not exist', async () => {
      await setKey('APP_ID', 'abcdef');

      const actual = await read(`${testDirectory}/.env`);
      expect(actual).toEqual('APP_ID="abcdef"');
    });
    it('should update an existing file when updating a key', async () => {
      await write('APP_ID="nope"', `${testDirectory}/.env`);

      await setKey('APP_ID', 'abcdef');

      const actual = await read(`${testDirectory}/.env`);
      expect(actual).toEqual('APP_ID="abcdef"');
    });
    it('should allow specifying a cwd', async () => {
      await write('APP_ID="nope"', `${testDirectory}/subfolder/.env`);

      await setKey('APP_ID', 'abcdef', { cwd: `${testDirectory}/subfolder` });

      const actual = await read(`${testDirectory}/subfolder/.env`);
      expect(actual).toEqual('APP_ID="abcdef"');
    });
  });

  describe('updateContent', () => {
    it.each([
      [
        {
          title: 'add new key',
          content: '',
          key: 'APP_ID',
          value: 'abcdef',
          expected: dedent`
            APP_ID="abcdef"
          `,
        },
      ],
      [
        {
          title: 'update key',
          content: dedent`
            APP_ID="abcdef"
            API_KEY="s3cr3t"
          `,
          key: 'APP_ID',
          value: 'xyz',
          expected: dedent`
            APP_ID="xyz"
            API_KEY="s3cr3t"
          `,
        },
      ],
      [
        {
          title: 'keep comments',
          content: dedent`
            # my APP_ID
            APP_ID="abcdef"
            # my secret API_KEY
            API_KEY="s3cr3t"
          `,
          key: 'APP_ID',
          value: 'xyz',
          expected: dedent`
            # my APP_ID
            APP_ID="xyz"
            # my secret API_KEY
            API_KEY="s3cr3t"
          `,
        },
      ],
    ])('$title', async ({ content, key, value, expected }) => {
      const actual = __.updateContent(content, key, value);
      expect(actual).toEqual(expected);
    });
  });
});
