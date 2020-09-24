const parser = require('@babel/parser');
const fs = require('fs');

const testData = `const menuList = configForTargets({
  default: [
    { key: '/system-evaluation/Summary', text: '总览' },
    {
      key: 'systemEvaluation',
      text: '架构评估',
      children: [
        { key: '/system-evaluation/sizing-evaluation', text: '体量维度' },
        { key: '/system-evaluation/coupling-evaluation', text: '耦合维度' },
        { key: '/system-evaluation/cohesion-evaluation', text: '内聚度维度' },
        { key: '/system-evaluation/Redundancy', text: '冗余度维度' },
      ],
    },
  ],
});`;

const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function createMemberExpression() {
  return t.objectExpression([
    {
      key: t.identifier('a'),
      type: 'ObjectProperty',
      // computed: false,
      // shorthand: true,
      // decorators: null,
      value: t.identifier('2222222'),
    },
  ]);
}

function compile(code) {
  const ast = parser.parse(code);

  traverse(ast, {
    StringLiteral(path) {
      if (path.node.value === 'systemEvaluation') {
        // const parent = path.parent;
        // console.log('parent: ', parent);
        // console.log('path 的值是：', path);
      }
    },
    ArrayExpression(path) {
      const { node } = path;
      node.elements.push(createMemberExpression());
      path.stop();
    },
  });

  return generator(ast, {}, code);
}

const result = compile(testData);
console.log('result: ', result);


fs.writeFileSync('message.js', JSON.stringify(result));

// console.log('result 的值是：', JSON.stringify(result));
