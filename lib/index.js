import noPiiLogging from './rules/no-pii-logging.js';
import noSensitiveObjectLogging from './rules/no-sensitive-object-logging.js';

import enforceFooBar from './rules/enforce-foo-bar.js';

/** @type {import("eslint").Linter.Plugin} */
export const rules = {
  'no-pii-logging': noPiiLogging,
  'no-sensitive-object-logging': noSensitiveObjectLogging,
  'enforce-foo-bar': enforceFooBar,
};

export default {
  rules
};
