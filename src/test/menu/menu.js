const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const fs = require('fs');
const path = require('path');

function createMemberExpression() {
  return t.objectExpression([
    {
      key: t.identifier('a'),
      type: 'ObjectProperty',
      value: t.identifier('2222222'),
    },
  ]);
}

function handleMenu(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    ObjectExpression(path) {
      path.node.properties.forEach((item) => {
        if (item.value.value === 'systemEvaluation') {
          path.traverse({
            ObjectProperty(path2) {
              //找到 children属性
              if (path2.node.key.name === 'children') {
                path2.node.value.elements.push(createMemberExpression());
              }
            },
          });
        }
      });
    },
  });

  return generator(
    ast,
    {
      retainLines: true,
      minified: false,
    },
    code
  );
}

const code = fs.readFileSync(path.join(__dirname, './rawData'), 'utf-8');

const result = handleMenu(code);
fs.writeFileSync(path.join(__dirname, './result'), JSON.stringify(result));
