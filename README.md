# 🦌 Keyleth

> Read and write environment variables in .env files

A lightweight module to read and write key-value pairs in `.env` files. Perfect for managing secrets and configuration that shouldn't be committed to version control.

## Installation

```bash
yarn add keyleth
```

## Usage

```javascript
import { getKey, setKey } from 'keyleth';

// Read a key from .env file
const token = await getKey('NPM_TOKEN');
// Returns the value, or null if file/key doesn't exist

// Use a fallback value if key doesn't exist
const apiUrl = await getKey('API_URL', 'https://api.example.com');
// Returns the value from .env, or the fallback if not found

// Write or update a key in .env file
await setKey('NPM_TOKEN', 'npm_abc123xyz');
// Creates the file if needed, updates the key if it exists

// Use a custom directory
await getKey('API_KEY', { cwd: '/path/to/directory' });
await setKey('API_KEY', 'secret', { cwd: '/path/to/directory' });

// Combine fallback with custom directory
await getKey('API_KEY', 'default-key', { cwd: '/path/to/directory' });
```

By default, keyleth looks for `.env` in your git repository root. Use the `cwd` option to specify a different directory.

### API

**`getKey(key, fallback?, options?)`**
- Returns the value for the specified key, or the fallback value if not found, or `null`
- `fallback` (optional): A string value to return if the key is not found
- `options` (optional): `{ cwd: string }` - Directory containing the `.env` file
- You can pass `options` as the second parameter if you don't need a fallback

**`setKey(key, value, options)`**
- Creates or updates a key in the `.env` file
- Values are automatically quoted
- Preserves comments and formatting
- Creates the file if it doesn't exist
- Options: `{ cwd: string }` - Directory containing the `.env` file

## File Format

Keyleth works with standard `.env` files (dotenv format):

```bash
# Comments are preserved
NPM_TOKEN="abc123"
API_KEY="secret"

# Empty lines are kept too
DATABASE_URL="postgresql://localhost/mydb"
```

## Why the name?

Keyleth is a druid in Critical Role first season. As someone that can manipulate
the _environment_, I thought that **Key**leth was a great name.
