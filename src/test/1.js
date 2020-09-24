const parser = require('@babel/parser');

const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function compile(code) {
  const ast = parser.parse(code);

  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node;
      if (
        t.isMemberExpression(callee) &&
        callee.object.name === 'console' &&
        callee.property.name === 'log'
      ) {
        const funcPath = path.findParent((p) => p.isFunctionDeclaration());
        path.node.arguments.unshift(
          t.stringLiteral(`${funcPath.node.id.name}`)
        );
      }
    },
  });

  return generator(ast, {}, code);
}

const result = compile(`function foo() {
  console.log('bar')
}`);

console.log('result 的值是：', result);
