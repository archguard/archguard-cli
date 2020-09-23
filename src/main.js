const program = require('commander');
const { version } = require('./constants');
const initCommandGenerate = require('./commands/generate');
const initCommandHelp = require('./commands/help');
const initCommandTest = require('./commands/test');

function initCommand() {
  initCommandGenerate(program);
  initCommandHelp(program);
  initCommandTest(program);
}

initCommand();

program.version(version).parse(process.argv);
