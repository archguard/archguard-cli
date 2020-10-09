const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { menuVisitor } = require('../../ast/visitors');

const menuCode = fs
  .readFileSync(path.join(__dirname, './rawData.tsx'))
  .toString();

function compile(code) {
  const menuAst = recast.parse(menuCode, {
    parser: require('recast/parsers/babel'),
  });

  recast.visit(
    menuAst,
    menuVisitor('xxx/xxx2', '中文菜单', 'systemEvaluation')
  );

  return {
    transformedMenuCode: recast.print(menuAst).code,
  };
}

const { transformedMenuCode } = compile();
console.log('transformedMenuCode: ', transformedMenuCode);

fs.writeFileSync(path.join(__dirname, './rawData.tsx'), transformedMenuCode);
