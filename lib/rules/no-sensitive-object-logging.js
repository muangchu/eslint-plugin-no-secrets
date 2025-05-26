const defaultSensitiveObjects = new Set([
  'payload',
  'meta',
  'headers',
  'req',
  'request',
  'res',
  'response',
  'token',
  'appMeta',
]);

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow logging sensitive objects or variables',
    },
    schema: [
      {
        type: 'object',
        properties: {
          objects: {
            type: 'array',
            items: { type: 'string' },
          },
          override: {
            type: 'boolean',
          }
        },
        additionalProperties: false,
      }
    ],
    messages: {
      logSensitive: 'Avoid logging sensitive object "{{object}}"',
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const { objects = [], override = false } = options;

    const sensitiveObjects = new Set(
      override ? objects : [...defaultSensitiveObjects, ...objects]
    );

    function reportIfSensitive(name, node) {
      if (sensitiveObjects.has(name)) {
        context.report({
          node,
          messageId: 'logSensitive',
          data: { object: name }
        });
      }
    }

    return {
      CallExpression(node) {
        const callee = node.callee;

        // Target only logging calls
        const isLoggingCall =
          callee.type === 'MemberExpression' &&
          (callee.property.name === 'log' ||
            ['info', 'debug', 'warn', 'error'].includes(callee.property.name));

        if (!isLoggingCall) return;

        for (const arg of node.arguments) {
          // Case: logger.info(payload);
          if (arg.type === 'Identifier') {
            reportIfSensitive(arg.name, arg);
          }

          // Case: logger.info({ header: headers });
          if (arg.type === 'ObjectExpression') {
            for (const prop of arg.properties) {
              if (prop.type === 'Property') {
                if (prop.key.type === 'Identifier') {
                  reportIfSensitive(prop.key.name, prop.key);
                }
                if (prop.value.type === 'Identifier') {
                  reportIfSensitive(prop.value.name, prop.value);
                }
              }
            }
          }

          // Case: logger.info('msg: ' + response);
          if (arg.type === 'BinaryExpression') {
            if (arg.right.type === 'Identifier') {
              reportIfSensitive(arg.right.name, arg.right);
            }
          }

          // Case: logger.info(`Result: ${response}`)
          if (arg.type === 'TemplateLiteral') {
            for (const expr of arg.expressions) {
              if (expr.type === 'Identifier') {
                reportIfSensitive(expr.name, expr);
              }
            }
          }
        }
      }
    };
  }
};
