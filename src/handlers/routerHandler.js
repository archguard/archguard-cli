const fs = require('fs');
const path = require('path');
const { routerVisitor } = require('../ast/visitors');
const { getSplitString } = require('../utils');
const recast = require('recast');
const { ROUTER_PATH } = require('../config');

function getRouterConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(path.join(process.cwd(), ROUTER_PATH), 'utf-8');
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

    const routerConfigFile = getRouterConfigFile();
    const code = handleRouter(routerConfigFile, menuPath);
    fs.writeFileSync(path.join(process.cwd(), ROUTER_PATH), code);
  } else {
    //TODO: 处理一级菜单
    console.log('routerHandler 没有指定父节点');
  }
}

module.exports = routerHandler;
