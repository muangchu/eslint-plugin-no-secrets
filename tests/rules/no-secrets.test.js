import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import rule from '../../lib/rules/no-secrets.js';

// ESLint v9 + Flat Config
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
});

describe('no-secrets rule', () => {
  it('should validate secret detection', () => {
    ruleTester.run('no-secrets', rule, {
      valid: [
        {
          code: 'const name = "Hello World";',
        },
        {
          code: 'let apiUrl = "https://example.com";',
        }
      ],
      invalid: [
        {
          code: 'const key = "AKIA1234567890ABCDE1";',
          errors: [{ messageId: 'potentialSecret' }]
        },
        {
          code: 'const token = "token:abcdef1234567890abcdef";',
          errors: [{ messageId: 'potentialSecret' }]
        }
      ]
    });
  });
});
