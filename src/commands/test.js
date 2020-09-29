const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');

function initCommandTest(program) {
  program
    .command('test')
    .alias('t')
    .action((options) => {
      fs.readFile(
        path.join(process.cwd(), './layouts/base/config.tsx'),
        (error, data) => {
          const code = data.toString();
          const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx'],
          });

          traverse(ast, {
            ExportNamedDeclaration(path) {
              // console.log('path: ', path);
            },
            Identifier(node) {
              if (node.name === 'key') {
                console.log('node: ', node);
              }
            },
          });
        }
      );
      // travel();
    });
}

module.exports = initCommandTest;
