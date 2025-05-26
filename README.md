# @muangchu/eslint-plugin-no-secrets

Disallow logging of sensitive information (PII) such as emails and phone numbers.

## Installation

```bash
npm install @muangchu/eslint-plugin-no-secrets --save-dev
```


## Usage

### Flat Config (ESLint v9+)
```js
import noSecrets from '@muangchu/eslint-plugin-no-secrets';

export default [
  {
    files: ['**/*.js'],
    plugins: {
      'no-secrets': noSecrets
    },
    rules: {
      'no-secrets/no-pii-logging': 'error'
    }
  }
];

```


## Development

### Local development (using npm link)
In your plugin directory:
```bash
npm link
```

In your Express.js project:
```bash
npm link @muangchu/eslint-plugin-no-secrets
```