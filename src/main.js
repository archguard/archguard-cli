const program = require('commander');
const { version } = require('./constants');
const initCommandGenerate = require('./commands/generate');
const initCommandHelp = require('./commands/help');
const initCommandUpdate = require('./commands/update');

function initCommand() {
  initCommandGenerate(program);
  initCommandHelp(program);
  initCommandUpdate(program);
}

initCommand();

program.version(version).parse(process.argv);
