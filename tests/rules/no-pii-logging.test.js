// detect-pii-logging.test.ts
import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import rule from '../../lib/rules/no-pii-logging.js';

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('detect-pii-logging', () => {
  it('should pass valid and invalid test cases', () => {
    tester.run('detect-pii-logging', rule, {
      valid: [
        'console.log("Hello world")',
        'logger.info({ status: 200 })',
        'log.debug("Operation complete")',
        'this.logger.debug("Safe message")',
        'logger.info(user.id)',
        'console.log("email")',
        'logger.info({ message: "email sent" })',
      ],
      invalid: [
        {
          code: 'console.log(email);',
          errors: [{ message: "Avoid logging PII directly: 'email'" }],
        },
        {
          code: 'logger.info({ email: user.email });',
          errors: [{ message: "Avoid logging object with PII key: 'email'" }],
        },
        {
          code: 'logger.info(`User phone: ${user.phone}`);',
          errors: [{ message: "Avoid logging PII property in template: 'phone'" }],
        },
        {
          code: 'this.logger.debug(req.body.phone);',
          errors: [{ message: "Avoid logging PII property: 'phone'" }],
        },
        // {
        //   code: 'log.debug("Request email: " + JSON.stringify(req.body.email));',
        //   errors: [{ message: "Avoid logging PII in string concatenation: 'email'" }],
        // },
      ],
    });
  });
});
