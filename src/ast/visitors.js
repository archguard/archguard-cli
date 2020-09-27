const routerVisitor = {
  visitArrayExpression(path) {
    const node = path.node;
    node.elements.push(
      objectExpression([
        {
          key: stringLiteral('abc2'),
          value: stringLiteral('中文'),
          type: 'ObjectProperty',
        },
      ])
    );
    // console.log('node.elements 的值是：', node.elements);
    return false;
  },
};
