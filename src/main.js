const program = require('commander');
const { version } = require('./constants');
const initCommandGenerate = require('./commands/generate');
const initCommandHelp = require('./commands/help');
const initCommandTest = require('./commands/test');

function initCommand() {
  if (!process.cwd().endsWith('/src')) {
    console.error('请在项目的 src 目录下运行！');
    return;
  }

  initCommandGenerate(program);
  initCommandHelp(program);
  initCommandTest(program);
}

initCommand();

program.version(version).parse(process.argv);
