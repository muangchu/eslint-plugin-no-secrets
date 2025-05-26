const PII_KEYS = ['email', 'phone', 'ssn', 'passport', 'address', 'name'];

function isLoggingFunction(node) {
  if (node.type !== 'MemberExpression') return false;

  const object = node.object;
  const property = node.property;

  const logObjectNames = ['console', 'logger', 'log'];
  const logMethods = ['log', 'info', 'debug', 'warn', 'error'];

  return (
    (object.type === 'Identifier' && logObjectNames.includes(object.name)) ||
    (object.type === 'MemberExpression' && object.property && logObjectNames.includes(object.property.name)) ||
    (object.type === 'ThisExpression' && node.property && logMethods.includes(property.name))
  ) && logMethods.includes(property.name);
}

function isPIIKey(name) {
  return PII_KEYS.includes(name);
}

function checkForPII(node, context) {
  if (!node) return;

  // e.g. console.log(email)
  if (node.type === 'Identifier' && isPIIKey(node.name)) {
    context.report({
      node,
      message: `Avoid logging PII directly: '${node.name}'`,
    });
  }

  // e.g. logger.info({ email: user.email })
  if (node.type === 'ObjectExpression') {
    for (const prop of node.properties) {
      const keyName = prop.key.name || prop.key.value;
      if (isPIIKey(keyName)) {
        context.report({
          node: prop,
          message: `Avoid logging object with PII key: '${keyName}'`,
        });
      }
    }
  }

  // e.g. logger.info(`User phone: ${user.phone}`)
  if (node.type === 'TemplateLiteral') {
    for (const expr of node.expressions) {
      if (
        expr.type === 'MemberExpression' &&
        expr.property &&
        isPIIKey(expr.property.name || expr.property.value)
      ) {
        context.report({
          node: expr,
          message: `Avoid logging PII property in template: '${expr.property.name}'`,
        });
      }
    }
  }

  // e.g. this.logger.debug(req.body.phone)
  if (node.type === 'MemberExpression') {
    if (node.property && isPIIKey(node.property.name || node.property.value)) {
      context.report({
        node,
        message: `Avoid logging PII property: '${node.property.name}'`,
      });
    }
  }

  // e.g. log.debug('Email: ' + req.body.email)
  if (node.type === 'BinaryExpression') {
    ['left', 'right'].forEach(side => {
      const part = node[side];
      if (
        part.type === 'MemberExpression' &&
        part.property &&
        isPIIKey(part.property.name || part.property.value)
      ) {
        context.report({
          node: part,
          message: `Avoid logging PII in string concatenation: '${part.property.name}'`,
        });
      }
    });
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect logging of PII data',
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!isLoggingFunction(node.callee)) return;

        node.arguments.forEach(arg => {
          checkForPII(arg, context);
        });
      },
    };
  },
};
