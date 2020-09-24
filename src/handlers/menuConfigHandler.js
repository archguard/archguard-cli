const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const fs = require('fs');
const path = require('path');
const { getSplitString, toUpperCaseFirstWord } = require('../utils');

// 使用 ag g page 生成页面组件时，第四个输入为 ’ foo/bar ‘,加入分隔符’/‘，
// 则被认为 在 key ='foo'的路由下面的 children 数组内加入菜单配置 ，自动配置好 menuList 菜单配置
// 例如 ag g page systemEvaluation/demo 测试 ，则会在 src/layouts/base/config.tsx 文件下产生如下菜单配置：

// {
//   key: "systemEvaluation",
//   text: "架构评估",
//   icon: <FileTextOutlined />,
//   children: [
//     { key: "/system-evaluation/Demo", text: "测试" },
//   ],
// },

// 由于遗留代码命名没统一，导致以下情况，父菜单 key 为 systemEvaluation ,而子菜单的 key 的父级前缀 为 /system-evaluation
// 所以建立 menuKeyMap 做一个映射关系
// {
//   key: "systemEvaluation",
//   text: "架构评估",
//   icon: <FileTextOutlined />,
//   children: [
//     { key: "/system-evaluation/Demo", text: "测试" },
//   ],
// },

const menuKeyMap = {
  systemEvaluation: 'system-evaluation',
  analysisTools: 'analysis',
};

function createMemberExpression(key, value) {
  return t.objectExpression([
    {
      key: t.identifier(key),
      type: 'ObjectProperty',
      value: t.StringLiteral(value),
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
                  createMemberExpression(
                    'key',
                    `/${menuKeyMap[parentKey]}/${childKey}`
                  )
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
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
