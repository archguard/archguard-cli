const { exec } = require('child_process');

function initCommandUpdate(program) {
  program
    .command('update')
    .alias('u')
    .description('更新到最新版本')
    .action((options) => {
      console.log('arch-guard-cli 更新中...');
      exec('npm i arch-guard-cli -g', (err, stdout, stderr) => {
        if (err) {
          console.log('arch-guard-cli 更新失败', err);
          return;
        }
        console.log('arch-guard-cli 更新完成');
      });
    });
}

module.exports = initCommandUpdate;
