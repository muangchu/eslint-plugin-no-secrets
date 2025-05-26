# @muangchu/eslint-plugin-no-secrets

Disallow logging of sensitive information (PII) such as emails and phone numbers.

## Installation

```bash
npm install eslint @eslint/js @muangchu/eslint-plugin-no-secrets --save-dev
```


## Usage

### Configuration (ESLint v9+)
```js
//eslint.config.mjs file

import { defineConfig } from "eslint/config";
import js from "@eslint/js";

import noSecrets from "@muangchu/eslint-plugin-no-secrets";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      js,
      "no-secrets": noSecrets,
    },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": "off",
      "no-secrets/no-pii-logging": error,
      "no-secrets/no-sensitive-object-logging": error,
    },
  },
]);
```

For custom fields, objects and override default 
```js
//eslint.config.mjs file

import { defineConfig } from "eslint/config";
import js from "@eslint/js";

import noSecrets from "@muangchu/eslint-plugin-no-secrets";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      js,
      "no-secrets": noSecrets,
    },
    extends: ["js/recommended"],
    rules: {
      "no-secrets/no-pii-logging": [
        "error",
        {
          fields: ["foo", "_80001"], // add custom fields
		      override: true, //override default fields
        },
      ],
      "no-secrets/no-sensitive-object-logging": [
        "error",
        {
          objects: ["session", "authToken"], // add custom objects
		      override: true, //override default objects
        },
      ],
    },
  },
]);
```

### Run
```bash
npx eslint .
```

Generate report
```bash
npx eslint . -f json -o eslint-report.json
```



## Development

### Run unit test
```bash
npm run test
```

### Local development (using npm link)
In your plugin directory:
```bash
npm link
```

In your Express.js project:
```bash
npm link @muangchu/eslint-plugin-no-secrets
```