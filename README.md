# eslint-plugin-no-secrets

Disallow logging of sensitive information (PII) such as emails and phone numbers.

## Installation

```bash
npm install eslint-plugin-no-secrets --save-dev
```


## Usage

### Flat Config (ESLint v9+)
```js
import noSecrets from 'eslint-plugin-no-secrets';

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