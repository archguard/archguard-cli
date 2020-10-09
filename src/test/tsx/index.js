const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { menuVisitor } = require('../../ast/visitors');
const { identifier, stringLiteral, objectExpression } = recast.types.builders;

const menuCode = fs
  .readFileSync(path.join(__dirname, './rawData.tsx'))
  .toString();

function compile(code) {
  const menuAst = recast.parse(menuCode, {
    parser: require('recast/parsers/babel'),
  });

  recast.visit(menuAst, {
    visitArrayExpression(path) {
      // console.log('path.node.elements 的值是：', path.node.elements);
      path.node.elements.forEach((item) => {
        item.properties = item.properties || [];
        item.properties.forEach((item2) => {
          if (
            item2.key.name === 'key' &&
            item2.value.value === 'systemEvaluation'
          ) {
            recast.visit(item, {
              visitArrayExpression(path2) {
                //TODO: 若此处 path2 上一行或者下一行代码有注释，会导致 插入的节点格式化与源文件不一致
                path2.value.elements.push(
                  objectExpression([
                    {
                      key: identifier('key'),
                      value: stringLiteral(`/${1}/${2}`),
                      type: 'ObjectProperty',
                    },
                    {
                      key: identifier('text'),
                      value: stringLiteral('menuName'),
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

  return {
    transformedMenuCode: recast.print(menuAst).code,
  };
}

const { transformedMenuCode } = compile();
// console.log('transformedMenuCode: ', transformedMenuCode);

fs.writeFileSync(path.join(__dirname, './rawData.tsx'), transformedMenuCode);
