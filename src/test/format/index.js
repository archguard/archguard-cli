const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

const code = fs.readFileSync(path.join(__dirname, './rawData.tsx')).toString();

function compile(code) {
  const ast = recast.parse(code);
  recast.visit(ast, {
    visitArrayExpression(path) {
      const node = path.node;
      node.elements.forEach((item) => {
        item.properties.forEach((item2) => {
          if (item2.value.value === '/:systemId') {
            // console.log('item2: ', item2);
            // console.log('item 的值是：', item);
            recast.visit(item, {
              visitArrayExpression(path) {
                const node2 = path.node;
                node2.elements.push(
                  objectExpression([
                    {
                      key: stringLiteral('abc2'),
                      value: stringLiteral('中文'),
                      type: 'ObjectProperty',
                    },
                  ])
                );
                // node2.elements.forEach((item3) => {
                //   item3.properties.forEach((item4) => {
                //     console.log('item4: ', item4.value.value);

                //   });
                // });
                return false;
              },
            });

            // console.log('item2.value.value: ', item2.value.value);
            // console.log('item 的值是：', item);
            // recast.visit(path, {
            //   visitObjectExpression(path2) {
            //     const node2 = path2.node;
            //     // console.log('node2: ', node2);
            //     // node2.elements.push(
            //     //   objectExpression([
            //     //     {
            //     //       key: stringLiteral('abc2'),
            //     //       value: stringLiteral('中文'),
            //     //       type: 'ObjectProperty',
            //     //     },
            //     //   ])
            //     // );
            //     node2.properties.forEach((item2) => {
            //       const key = item2.key.name;
            //       console.log('key: ', key);
            //     });
            //     return false;
            //   },
            // });
          }
        });
      });

      // node.elements.push(
      //   objectExpression([
      //     {
      //       key: stringLiteral('abc2'),
      //       value: stringLiteral('中文'),
      //       type: 'ObjectProperty',
      //     },
      //   ])
      // );
      // console.log('node.elements 的值是：', node.elements);
      return false;
    },
  });

  return recast.print(ast).code;
}

const res = compile(code);

fs.writeFileSync(path.join(__dirname, './rawData2.tsx'), res);
