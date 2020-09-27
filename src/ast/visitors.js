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
                path.node.elements.push(
                  objectExpression([
                    {
                      key: identifier('path'),
                      value: stringLiteral(routerPath),
                      type: 'ObjectProperty',
                    },
                    {
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
      // console.log('parentKey 的值是：', parentKey);
      path.node.elements.forEach((item) => {
        item.properties.forEach((item2) => {
          // console.log('item2.key.name 的值是：', item2.key.name);
          // console.log('item2.value.value 的值是：', item2.value.value);
          if (item2.key.name === 'key' && item2.value.value === parentKey) {
            // console.log('item 的值是：', item);
            recast.visit(item, {
              visitArrayExpression(path2) {
                // path2.value.elements.push(
                //   objectExpression([
                //     {
                //       key: identifier('key'),
                //       value: stringLiteral('/' + key),
                //       type: 'ObjectProperty',
                //     },
                //     {
                //       key: identifier('text'),
                //       value: stringLiteral(menuName),
                //       type: 'ObjectProperty',
                //     },
                //   ])
                // );
                return false;
              },
            });
          }
          // if (item2.value.value === parentKey) {
          //   recast.visit(item, {
          //     visitArrayExpression(path2) {
          //       console.log('path2: ', path2);
          //     },
          //   });
          // }
          // console.log('item2: ', item2.value);
          // if (item2.value.value === '/:systemId') {}
        });
      });
      return false;
    },
  };
};
