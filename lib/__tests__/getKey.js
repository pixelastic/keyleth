import { remove, tmpDirectory, write } from 'firost';
import { __, getKey } from '../getKey.js';

describe('getKey', () => {
  describe('getKey()', () => {
    const testDirectory = tmpDirectory('keyleth/getKey');
    beforeEach(async () => {
      vi.spyOn(__, 'gitRoot').mockReturnValue(testDirectory);
    });
    afterEach(async () => {
      await remove(testDirectory);
    });

    it('should return null if .env file does not exist', async () => {
      const actual = await getKey('SOME_KEY');

      expect(actual).toBe(null);
    });

    it('should read an easy value', async () => {
      await write(
        dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
        `${testDirectory}/.env`,
      );

      const actual = await getKey('API_KEY');

      expect(actual).toBe('s3cr3t');
    });

    it('should allow passing a custom cwd', async () => {
      await write(
        dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
        `${testDirectory}/subfolder/.env`,
      );

      const actualRoot = await getKey('API_KEY');
      expect(actualRoot).toBe(null);

      const actualSubfolder = await getKey('API_KEY', {
        cwd: `${testDirectory}/subfolder`,
      });
      expect(actualSubfolder).toBe('s3cr3t');
    });

    it('should return fallback string when key does not exist', async () => {
      await write(
        dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
        `${testDirectory}/.env`,
      );

      const actual = await getKey('MISSING_KEY', 'default_value');

      expect(actual).toBe('default_value');
    });

    it('should return value when key exists even if fallback is provided', async () => {
      await write(
        dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
        `${testDirectory}/.env`,
      );

      const actual = await getKey('API_KEY', 'default_value');

      expect(actual).toBe('s3cr3t');
    });

    it('should return fallback when .env file does not exist', async () => {
      const actual = await getKey('SOME_KEY', 'default_value');

      expect(actual).toBe('default_value');
    });

    it('should support fallback with custom cwd (fallback as 2nd arg, options as 3rd)', async () => {
      await write(
        dedent`
            APP_ID=abcdef
          `,
        `${testDirectory}/subfolder/.env`,
      );

      const actual = await getKey('MISSING_KEY', 'default_value', {
        cwd: `${testDirectory}/subfolder`,
      });

      expect(actual).toBe('default_value');
    });

    it('should support reading existing key with fallback and custom cwd', async () => {
      await write(
        dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
        `${testDirectory}/subfolder/.env`,
      );

      const actual = await getKey('API_KEY', 'default_value', {
        cwd: `${testDirectory}/subfolder`,
      });

      expect(actual).toBe('s3cr3t');
    });
  });

  describe('getKeyFromContent', () => {
    it.each([
      [
        {
          title: 'simple key',
          content: dedent`
            APP_ID=abcdef
            API_KEY=s3cr3t
          `,
          input: 'APP_ID',
          expected: 'abcdef',
        },
      ],
      [
        {
          title: 'simple key with quotes',
          content: dedent`
            APP_ID="abcdef"
            API_KEY="s3cr3t"
          `,
          input: 'APP_ID',
          expected: 'abcdef',
        },
      ],
      [
        {
          title: 'no such key',
          content: dedent`
            API_KEY=s3cr3t
          `,
          input: 'APP_ID',
          expected: null,
        },
      ],
      [
        {
          title: 'ignore comments',
          content: dedent`
            # The next line is commented out
            # APP_ID=abcdef
            API_KEY=s3cr3t
          `,
          input: 'APP_ID',
          expected: null,
        },
      ],
      [
        {
          title: 'blank lines',
          content: dedent`
            APP_ID="abcdef"




            API_KEY="s3cr3t"
          `,
          input: 'API_KEY',
          expected: 's3cr3t',
        },
      ],
      [
        {
          title: 'no values',
          content: dedent`
            APP_ID=
            API_KEY=s3cr3t
          `,
          input: 'APP_ID',
          expected: null,
        },
      ],
      [
        {
          title: 'values with = sign',
          content: dedent`
            APP_URL=https://example.com?foo=bar
          `,
          input: 'APP_URL',
          expected: 'https://example.com?foo=bar',
        },
      ],
    ])('$title', async ({ content, input, expected }) => {
      const actual = __.getKeyFromContent(content, input);
      expect(actual).toEqual(expected);
    });
  });
});
