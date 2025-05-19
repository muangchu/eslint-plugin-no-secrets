/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow potential secrets like API keys in string literals',
      recommended: true
    },
    messages: {
      potentialSecret: 'Possible secret detected in string: "{{string}}"'
    },
    schema: []
  },

  create(context) {
    const patterns = [
      /AKIA[0-9A-Z]{16}/,                              // AWS access key
      /(?:api|token|key)[\s:=]+[0-9a-zA-Z-_]{16,}/i,   // generic keys
      /\b[0-9a-f]{32,}\b/i                             // hex secrets
    ];

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        for (const pattern of patterns) {
          if (pattern.test(node.value)) {
            context.report({
              node,
              messageId: 'potentialSecret',
              data: { string: node.value }
            });
            break;
          }
        }
      }
    };
  }
};

export default rule;
