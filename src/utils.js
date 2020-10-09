const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const recast = require('recast');

function getSplitString(str, flag = '/') {
  const parent = str.slice(0, str.indexOf(flag));
  const child = str.slice(str.indexOf(flag) + 1);
  return { parent, child };
}

function toUpperCaseFirstWord(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// foo/bar => foo/Bar
function formatFileName(fileName) {
  const { parent, child } = getSplitString(fileName);
  return `${parent}/${toUpperCaseFirstWord(child)}`;
}

function generateFileByTemplate(template, data) {
  const content = Handlebars.compile(template)(data);
  return content;
}

function transform(filePath, visitFn) {
  const code = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  const ast = recast.parse(code, {
    parser: require('recast/parsers/babel'), // recast 默认使用的 parser 为  esprima，处理不了 jsx
  });
  visitFn(ast);
  const result = recast.print(ast).code;
  fs.writeFileSync(path.join(process.cwd(), filePath), result);
}

function validate(conditions) {
  let res = true;
  for (const item of conditions) {
    if (item.fn()) {
      res = false;
      console.error(item.message);
    }
  }
  return (callback) => res && callback();
}

module.exports = {
  getSplitString,
  toUpperCaseFirstWord,
  generateFileByTemplate,
  validate,
  formatFileName,
  transform,
};
