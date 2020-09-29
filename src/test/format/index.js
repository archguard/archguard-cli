const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { routerVisitor, menuVisitor } = require('../../ast/visitors');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

const routerCode = fs
  .readFileSync(path.join(__dirname, './router.tsx'))
  .toString();

const menuCode = fs.readFileSync(path.join(__dirname, './menu.tsx')).toString();

function compile(code) {
  const routerAst = recast.parse(routerCode);
  const menuAst = recast.parse(menuCode);

  recast.visit(routerAst, routerVisitor('xxx', '中文path'));

  recast.visit(
    menuAst,
    menuVisitor('xxx/xxx2', '中文菜单', 'systemEvaluation')
  );

  return {
    transformedRouterCode: recast.print(routerAst).code,
    transformedMenuCode: recast.print(menuAst).code,
  };
}

const { transformedRouterCode, transformedMenuCode } = compile();

fs.writeFileSync(path.join(__dirname, './menu.tsx'), transformedMenuCode);

fs.writeFileSync(path.join(__dirname, './router.tsx'), transformedRouterCode);
