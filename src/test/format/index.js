const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const code = fs.readFileSync(path.join(__dirname, './rawData')).toString();

function compile(code) {
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  return generator(
    ast,
    {
      // retainLines: true,
      // compact: true,
    },
    code
  );
}

const res = compile(code);
console.log('res.code: ', res.code);
