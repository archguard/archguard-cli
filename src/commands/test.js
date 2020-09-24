const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');

console.log('parser.parse 的值是：', parser.parse);

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
            plugins: ['typescript', 'jsx'],
          });
          console.log('ast: ', ast);
          // console.log('ast2: ', ast);
        }
      );
      // travel();
    });
}

module.exports = initCommandTest;
