// 处理菜单文件

const { MENU_PATH } = require('../config');
const { transform, getSplitString } = require('../utils');
const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

/**
 * @param {*} pathArg 路径参数 例如 xxx/xxx2
 * @param {*} menuName 菜单显示文本 例如 主页
 */
module.exports = (pathArg, menuName) => {
  transform(MENU_PATH, (ast) => {
    let { parent, child } = getSplitString(pathArg);

    recast.visit(ast, {
      visitArrayExpression(path) {
        path.node.elements.forEach((item) => {
          item.properties = item.properties || [];
          item.properties.forEach((item2) => {
            if (item2.key.name === 'key' && item2.value.value === parent) {
              recast.visit(item, {
                visitArrayExpression(path2) {
                  //TODO: 若此处 path2 上一行或者下一行代码有注释，会导致 插入的节点格式化与源文件不一致
                  path2.value.elements.push(
                    objectExpression([
                      {
                        key: identifier('key'),
                        value: stringLiteral(`/${parent}/${child}`),
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
  });
};
