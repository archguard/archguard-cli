const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

exports.routerVisitor = (routerPath = '', componentPath = '') => {
  return {
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
                      value: stringLiteral(routerPath),
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
  };
};

exports.menuVisitor = (key = '', menuName = '', parentKey = '') => {
  if (!parentKey) {
    //TODO: 处理 不传入parentKey的情况
    // 此时，添加一级菜单
  }
  return {
    visitArrayExpression(path) {
      path.node.elements.forEach((item) => {
        console.log('item: ', item);
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
  };
};
