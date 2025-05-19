import { RuleTester } from 'eslint';
import rule from '../../lib/rules/no-pii-logging.js';

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-pii-logging', rule, {
  valid: [
    `logger.info("User logged in")`,
    `this.logger.debug("Processing")`,
    `log.warn("No data provided")`,
    `logger.info({ status: "OK", count: 3 })`
  ],

  invalid: [
    {
      code: `logger.info({ email: user.email });`,
      errors: [{ messageId: 'piiLogged', data: { field: 'email' } }],
    },
    {
      code: `logger.info(\`User phone: \${user.phone}\`);`,
      errors: [{ messageId: 'piiLogged', data: { field: 'template' } }],
    },
    {
      code: `this.logger.debug(req.body.phone);`,
      errors: [{ messageId: 'piiLogged', data: { field: 'phone' } }],
    },
    {
      code: `log.debug(req.body.email);`,
      errors: [{ messageId: 'piiLogged', data: { field: 'email' } }],
    },
    {
      code: `this.logger.info({ email: req.body.email });`,
      errors: [{ messageId: 'piiLogged', data: { field: 'email' } }],
    },
    {
      code: `log.debug('Request email: ' + JSON.stringify(req.body.email));`,
      errors: [{ messageId: 'piiLogged', data: { field: 'email' } }],
    },
  ]
});
