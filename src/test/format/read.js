const recast = require('recast');

recast.run(function (ast, printSource) {
  printSource(ast);
});
