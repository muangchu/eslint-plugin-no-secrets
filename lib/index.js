import noSecrets from './rules/no-secrets.js';

/** @type {import("eslint").Linter.Plugin} */
export const rules = {
  'no-secrets': noSecrets
};
