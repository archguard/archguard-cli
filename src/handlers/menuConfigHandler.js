const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { menuVisitor } = require('../ast/visitors');
const { getSplitString } = require('../utils');

function getMenuConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(
    path.join(process.cwd(), './layouts/base/config.tsx'),
    'utf-8'
  );
}

function handleMenu(code, menuPath, menuName) {
  if (!menuName) {
    console.error('请设置最后一个参数为菜单名 例如： ag g page xxx/xxx2 首页');
    menuName = menuPath;
  }
  let { parent, child } = getSplitString(menuPath);
  const menuAst = recast.parse(code);
  recast.visit(menuAst, menuVisitor(child, menuName, parent));
  return recast.print(menuAst).code;
}

/**
 *
 *
 * @param {*} menuPath 菜单路径 例如 systemEvaluation/demo（父/子）,若不加分隔符 /，则视为新增一级菜单
 * @param {*} menuName 菜单显示文字
 */
function menuConfigHandler(menuPath, menuName) {
  if (menuPath.includes('/')) {
    let { child } = getSplitString(menuPath);
    if (!child) {
      console.error('分隔符后面不能为空字符！');
      return;
    }

    const menuConfigFile = getMenuConfigFile();
    const code = handleMenu(menuConfigFile, menuPath, menuName);
    fs.writeFileSync(
      path.join(process.cwd(), './layouts/base/config.tsx'),
      code
    );
  } else {
    //TODO: 处理顶级菜单
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
