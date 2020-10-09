// 处理菜单文件

const { ROUTER_PATH } = require('../config');
const { transform, getSplitString } = require('../utils');
const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

/**
 * @param {*} pathArg 路径参数 例如 xxx/xxx2
 */
module.exports = (pathArg) => {
  transform(ROUTER_PATH, (ast) => {
    let { child } = getSplitString(pathArg);
    const componentPath = `@/pages/${pathArg}/${child}`;
    recast.visit(ast, {
      visitArrayExpression(path) {
        path.node.elements.forEach((item) => {
          item.properties.forEach((item2) => {
            if (item2.value.value === '/:systemId') {
              recast.visit(item, {
                visitArrayExpression(path) {
                  //TODO: 若此处 path上一行或者下一行代码有注释，会导致 插入的节点格式化与源文件不一致
                  path.node.elements.push(
                    objectExpression([
                      {
                        key: identifier('path'),
                        value: stringLiteral(pathArg),
                        type: 'ObjectProperty',
                      },
                      {
                        // { path: "xxx/xxx2", component: "@/pages/xxx/xxx2/xxx2" },
                        key: identifier('component'),
                        value: stringLiteral(componentPath),
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
