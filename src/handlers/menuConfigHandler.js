const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const fs = require('fs');
const path = require('path');
const { getSplitString } = require('../utils');

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

/**
 *
 *
 * @param {*} menuPath 菜单路径 例如 systemEvaluation/demo（父/子）,若不加分隔符 /，则视为新增一级菜单
 * @param {*} menuText 菜单显示文字
 */
function menuConfigHandler(menuPath, menuText) {
  if (menuPath.includes('/')) {
    const { parent, child } = getSplitString(menuPath);
    console.log('child: ', child);
    console.log('parent: ', parent);
  } else {
    console.log('menuConfigHandler 没有指定父节点');
  }
}

module.exports = menuConfigHandler;
