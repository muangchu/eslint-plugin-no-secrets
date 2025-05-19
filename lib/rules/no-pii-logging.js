export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow logging of PII data like email, phone, etc.',
      recommended: true,
    },
    messages: {
      piiLogged: 'Avoid logging sensitive data such as "{{ field }}"',
    },
    schema: [],
  },

  create(context) {
    const piiFields = ['email', 'phone', 'ssn', 'address', 'username'];

    const isLoggingCall = (callee) => {
      // Match: logger.info, this.logger.debug, log.debug, etc.
      return (
        callee.type === 'MemberExpression' &&
        ['info', 'debug', 'warn', 'error', 'log'].includes(callee.property.name)
      );
    };

    const containsPII = (node) => {
      const check = (text) => piiFields.some((field) => text.includes(field));

      if (!node) return null;

      switch (node.type) {
        case 'Literal':
          return typeof node.value === 'string' ? check(node.value) : null;

        case 'Identifier':
          return check(node.name) ? node.name : null;

        case 'TemplateLiteral':
          return node.quasis.some(q => check(q.value.raw)) ? 'template' : null;

        case 'BinaryExpression':
          return (containsPII(node.left) || containsPII(node.right));

        case 'MemberExpression':
          if (node.property.type === 'Identifier') {
            return check(node.property.name) ? node.property.name : null;
          }
          return null;

        case 'ObjectExpression':
          for (const prop of node.properties) {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              check(prop.key.name)
            ) {
              return prop.key.name;
            }
          }
          return null;

        default:
          return null;
      }
    };

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (!isLoggingCall(callee)) return;

        for (const arg of node.arguments) {
          const pii = containsPII(arg);
          if (pii) {
            context.report({
              node: arg,
              messageId: 'piiLogged',
              data: { field: pii },
            });
            break;
          }
        }
      }
    };
  }
};
