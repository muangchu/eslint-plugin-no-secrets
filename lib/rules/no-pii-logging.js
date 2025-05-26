/**
 * @fileoverview Disallow logging PII data
 */

"use strict";

const DEFAULT_PII_FIELDS = ['email', 'phone', 'ssn', 'password'];

export default {
  meta: {
    type: "problem",
    docs: {
      description: "disallow logging of PII data",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          fields: {
            type: "array",
            items: {
              type: "string"
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      logPII: "Logging of PII data '{{field}}' is not allowed."
    }
  },

  create(context) {
    const config = context.options[0] || {};
    const piiFields = new Set([...(config.fields || []), ...DEFAULT_PII_FIELDS]);

    function checkNode(node, text, loc) {
      for (const field of piiFields) {
        if (text.includes(field)) {
          context.report({
            node,
            messageId: "logPII",
            data: { field },
            loc
          });
        }
      }
    }

    return {
      CallExpression(node) {
        const calleeName = node.callee?.name || node.callee?.property?.name;

        if (!calleeName || !['log', 'info', 'debug', 'warn', 'error'].includes(calleeName)) return;

        for (const arg of node.arguments) {
          if (arg.type === 'Identifier') {
            const name = arg.name;
            if (piiFields.has(name)) {
              context.report({
                node: arg,
                messageId: "logPII",
                data: { field: name },
                loc: arg.loc
              });
            }
          }
  
          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            checkNode(arg, arg.value, arg.loc);
          }

          if (arg.type === 'TemplateLiteral') {
            const raw = arg.quasis.map(q => q.value.raw).join('');
            checkNode(arg, raw, arg.loc);
          }

          if (arg.type === 'ObjectExpression') {
            for (const prop of arg.properties) {
              if (prop.key && prop.key.type === 'Identifier' && piiFields.has(prop.key.name)) {
                context.report({
                  node: prop,
                  messageId: "logPII",
                  data: { field: prop.key.name },
                  loc: prop.key.loc
                });
              }
            }
          }

          if (arg.type === 'BinaryExpression') {
            const text = context.getSourceCode().getText(arg);
            checkNode(arg, text, arg.loc);
          }

          if (arg.type === 'MemberExpression') {
            const text = context.getSourceCode().getText(arg);
            checkNode(arg, text, arg.loc);
          }
        }
      }
    };
  }
};
