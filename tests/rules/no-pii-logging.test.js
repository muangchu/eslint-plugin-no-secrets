import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import rule from "../../lib/rules/no-pii-logging.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("no-pii-logging", () => {
  it("should enforce foo = bar", () => {
    tester.run("no-pii-logging", rule, {
      valid: [
        {
          code: `console.log('nothing sensitive here');`,
        },
        {
          code: `logger.info({ id: user.id });`,
        },
        {
          code: `console.log(email);`,
          options: [{ fields: ["secret"], override: true }],
        },
      ],
      invalid: [
        {
          code: `console.log(email);`,
          errors: [{ messageId: "logPII", data: { field: "email" } }],
        },
        {
          code: `logger.info({ email: user.email });`,
          errors: [{ messageId: "logPII", data: { field: "email" } }],
        },
        {
          code: "logger.info(`User phone: ${user.phone}`);",
          errors: [{ messageId: "logPII", data: { field: "phone" } }],
        },
        {
          code: "this.logger.debug(req.body.phone);",
          errors: [{ messageId: "logPII", data: { field: "phone" } }],
        },
        {
          code: `log.debug('Request email: ' + JSON.stringify(req.body.email));`,
          errors: [{ messageId: "logPII", data: { field: "email" } }],
        },
        {
          code: `console.log(secret);`,
          options: [{ fields: ["secret"], override: true }],
          errors: [{ messageId: "logPII", data: { field: "secret" } }],
        },
      ],
    });
  });
});
