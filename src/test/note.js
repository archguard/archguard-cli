const t = require('@babel/types');

// 创建一个对象访问ast
function createMemberExpression() {
  return t.memberExpression(// 第一个参数为 对象名，第二个为对象属性
    t.identifier('console'),
    t.identifier('log')
  );
}