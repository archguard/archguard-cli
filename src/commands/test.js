const { travel } = require('../utils');

function initCommandTest(program) {
  program.command('test').action((options) => {
    console.log('test');
    // travel();
  });
}

module.exports = initCommandTest;
