const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;
const { menuVisitor } = require('../ast/visitors');
const { getSplitString, toUpperCaseFirstWord } = require('../utils');

function getMenuConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(
    path.join(process.cwd(), './layouts/base/config.tsx'),
    'utf-8'
  );
}

function handleMenu(code, menuPath, menuName) {
  let { parent, child } = getSplitString(menuPath);
  const menuAst = recast.parse(code);
  recast.visit(menuAst, menuVisitor(child, menuName, parent));
  return recast.print(menuAst).code;
}

/**
 *
 *
 * @param {*} menuPath 菜单路径 例如 systemEvaluation/demo（父/子）,若不加分隔符 /，则视为新增一级菜单
 * @param {*} menuText 菜单显示文字
 */
function menuConfigHandler(menuPath, menuText) {
  console.log('menuPath: ', menuPath);
  if (menuPath.includes('/')) {
    let { child } = getSplitString(menuPath);
    if (!child) {
      console.error('分隔符后面不能为空字符！');
      return;
    }

    child = toUpperCaseFirstWord(child);
    const menuConfigFile = getMenuConfigFile();
    const codeResult = handleMenu(menuConfigFile, menuPath, '测试');
    fs.writeFileSync(
      path.join(process.cwd(), './layouts/base/config.tsx'),
      codeResult
    );
  } else {
    //TODO: 处理顶级菜单
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
