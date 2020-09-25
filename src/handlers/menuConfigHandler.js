const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const fs = require('fs');
const path = require('path');
const { getSplitString, toUpperCaseFirstWord } = require('../utils');

function createMemberExpression(parentKey, childKey) {
  return t.objectExpression([
    {
      key: t.identifier('key'),
      type: 'ObjectProperty',
      value: t.StringLiteral(`/${parentKey}/${childKey}`),
    },
    {
      key: t.identifier('text'),
      type: 'ObjectProperty',
      value: t.StringLiteral(`中文`),
      // value: t.StringLiteral(`/${parentKey}/${childKey}`),
    },
  ]);
}

function handleMenu(code, parentKey, childKey) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    ObjectExpression(path) {
      path.node.properties.forEach((item) => {
        //TODO: 处理没有找到 key 的情况，给予提示
        if (item.value.value === parentKey) {
          path.traverse({
            ObjectProperty(path2) {
              //找到 children属性
              if (path2.node.key.name === 'children') {
                path2.node.value.elements.push(
                  createMemberExpression(parentKey, childKey)
                );
              }
            },
          });
        }
      });
    },
  });

  return generator(
    ast,
    {
      // retainLines: true,
      // minified: false,
    },
    code
  );
}

function getMenuConfigFile() {
  //默认都在 src 目录下执行
  return fs.readFileSync(
    path.join(process.cwd(), './layouts/base/config.tsx'),
    'utf-8'
  );
}

function rewrite(newCode) {
  fs.writeFile(
    path.join(process.cwd(), './layouts/base/config.tsx'),
    newCode,
    {
      encoding: 'utf-8',
    },
    () => {}
  );
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
    let { parent, child } = getSplitString(menuPath);
    if (!child) {
      console.error('分隔符后面不能为空字符！');
      return;
    }
    child = toUpperCaseFirstWord(child);
    const menuConfigFile = getMenuConfigFile();

    const codeResult = handleMenu(menuConfigFile, parent, child);
    rewrite(codeResult.code);
  } else {
    //TODO: 处理顶级菜单
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
