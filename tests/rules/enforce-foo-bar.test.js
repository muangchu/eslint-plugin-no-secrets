import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import fooBarRule from "../../lib/rules/enforce-foo-bar";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("enforce-foo-bar rule", () => {
  it("should enforce foo = bar", () => {
    // Throws error if the tests in ruleTester.run() do not pass
    ruleTester.run(
      "enforce-foo-bar", // rule name
      fooBarRule, // rule code
      {
        // checks
        // 'valid' checks cases that should pass
        valid: [
          {
            code: "const foo = 'bar';",
          },
        ],
        // 'invalid' checks cases that should not pass
        invalid: [
          {
            code: "const foo = 'baz';",
            output: 'const foo = "bar";',
            errors: 1,
          },
        ],
      }
    );
  });
});
