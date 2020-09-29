const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const fs = require('fs');

// target：
// function square(x) {
//   return x * x;
// }

const code = `function square(n) {
  return n * n;
  n;
}`;

const ast = parser.parse(code);

let paramName;

const MyVisitor = {};

traverse(ast, {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = 'x';
    path.traverse({
      Identifier(path) {
        
      }
    })

  },
  Identifier(path) {
    // if (path.node.name === paramName) {
    //   path.node.name = 'x';
    // }
  },
});

const result = generator(ast, {}, code);
console.log('result: ', result);
