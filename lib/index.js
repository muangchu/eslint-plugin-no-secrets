import noSecrets from './rules/no-secrets.js';
import noPiiLogging from './rules/no-pii-logging.js';
import noSensitiveObjectLogging from './rules/no-sensitive-object-logging.js';

/** @type {import("eslint").Linter.Plugin} */
export const rules = {
  'no-secrets': noSecrets,
  'no-pii-logging': noPiiLogging,
  'no-sensitive-object-logging': noSensitiveObjectLogging
};

export default {
  rules
};
