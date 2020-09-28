const fs = require('fs');
const path = require('path');
const { routerVisitor } = require('../ast/visitors');
const { getSplitString, toUpperCaseFirstWord } = require('../utils');
const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

function getRouterConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(path.join(process.cwd(), '../.umirc.ts'), 'utf-8');
}

function handleRouter(code, menuPath) {
  let { child } = getSplitString(menuPath);
  const routerAst = recast.parse(code);
  recast.visit(
    routerAst,
    routerVisitor(menuPath, `@/pages/${menuPath}/${child}`)
  );
  return recast.print(routerAst).code;
}

/**
 *
 *
 * @param {*} menuPath 菜单路径 例如 systemEvaluation/demo（父/子）,若不加分隔符 /，则视为新增一级菜单
 * @param {*} menuText 菜单显示文字
 */
function routerHandler(menuPath) {
  if (menuPath.includes('/')) {
    let { parent, child } = getSplitString(menuPath);
    if (!child) {
      console.error('分隔符后面不能为空字符！');
      return;
    }

    child = toUpperCaseFirstWord(child);
    const routerConfigFile = getRouterConfigFile();
    const code = handleRouter(routerConfigFile, menuPath);
    fs.writeFileSync(path.join(process.cwd(), '../.umirc.ts'), code);
  } else {
    //TODO: 处理一级菜单
    console.log('routerHandler 没有指定父节点');
  }
}

module.exports = routerHandler;