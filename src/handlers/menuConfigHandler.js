const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { MENU_PATH } = require('../config');
const { getSplitString } = require('../utils');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

function getMenuConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(path.join(process.cwd(), MENU_PATH), 'utf-8');
}

function visitAst(ast, { key, menuName, parentKey }) {
  recast.visit(ast, {
    visitArrayExpression(path) {
      path.node.elements.forEach((item) => {
        item.properties = item.properties || [];
        item.properties.forEach((item2) => {
          if (item2.key.name === 'key' && item2.value.value === parentKey) {
            recast.visit(item, {
              visitArrayExpression(path2) {
                //TODO: 若此处 path2 上一行或者下一行代码有注释，会导致 插入的节点格式化与源文件不一致
                path2.value.elements.push(
                  objectExpression([
                    {
                      key: identifier('key'),
                      value: stringLiteral(`/${parentKey}/${key}`),
                      type: 'ObjectProperty',
                    },
                    {
                      key: identifier('text'),
                      value: stringLiteral(menuName),
                      type: 'ObjectProperty',
                    },
                  ])
                );
                return false;
              },
            });
          }
        });
      });
      return false;
    },
  });
}

function handleMenu(code, menuPath, menuName) {
  if (!menuName) {
    console.error('请设置最后一个参数为菜单名 例如： ag g page xxx/xxx2 首页');
    menuName = menuPath;
  }
  let { parent, child } = getSplitString(menuPath);
  const menuAst = recast.parse(code, {
    parser: require('recast/parsers/babel'),
  });
  visitAst(menuAst, {
    key: child,
    menuName,
    parentKey: parent,
  });
  return recast.print(menuAst).code;
}

/**
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
    fs.writeFileSync(path.join(process.cwd(), MENU_PATH), code);
  } else {
    //TODO: 处理顶级菜单
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
