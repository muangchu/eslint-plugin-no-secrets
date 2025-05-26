import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import rule from "../../lib/rules/no-sensitive-object-logging.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("no-log-sensitive-object", () => {
  it("should enforce foo = bar", () => {
    ruleTester.run("no-log-sensitive-object", rule, {
      valid: [
        { code: `logger.info("hello world")` },
        { code: `logger.info(nonSensitiveData)` },
        { code: `logger.info({ user: userInfo })` },
        // {
        //   code: `logger.info(token);`,
        //   options: [{ objects: [] }], // override defaults
        // },
      ],
      invalid: [
        {
          code: `logger.info(payload);`,
          errors: [{ messageId: "logSensitive", data: { object: "payload" } }],
        },
        {
          code: `this.logger.debug(meta);`,
          errors: [{ messageId: "logSensitive", data: { object: "meta" } }],
        },
        {
          code: `console.log({ token });`,
          errors: [{ messageId: "logSensitive", data: { object: "token" } }],
        },
        {
          code: `log.warn({ header: headers });`,
          errors: [{ messageId: "logSensitive", data: { object: "headers" } }],
        },
        {
          code: `this.logger.debug(appMeta);`,
          errors: [{ messageId: "logSensitive", data: { object: "appMeta" } }],
        },
        {
          code: `this.logger.info('request: ' + req);`,
          errors: [{ messageId: "logSensitive", data: { object: "req" } }],
        },
        {
          code: `this.logger.info('response: ' + response);`,
          errors: [{ messageId: "logSensitive", data: { object: "response" } }],
        },
        {
          code: `logger.info(\`Result: \${response}\`);`,
          errors: [{ messageId: "logSensitive", data: { object: "response" } }],
        },
      ],
    });
  });
});
