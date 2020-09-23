const fs = require('fs');
const path = require('path');

const {
  toUpperCaseFirstWord,
  generateFileByTemplate,
  validate,
} = require('../utils');

const FILE_PATH = {
  pagesPath: './pages', //页面存放的路径 TODO: 处理首字母大小写
  componentsPath: './components', //组件存放的路径，TODO: 处理首字母大小写
};

const ACTION_NAME = 'page';

function copyTemplate(from, to, fileName) {
  from = path.join(__dirname, '../templates', from);
  const rawContent = fs.readFileSync(from, 'utf-8');
  const finalContent = generateFileByTemplate(rawContent, {
    fileName,
  });
  fs.writeFileSync(to, finalContent);
}

function generatePage(fileName) {
  fileName = toUpperCaseFirstWord(fileName);
  fs.mkdirSync(FILE_PATH.pagesPath + `/${fileName}`);
  copyTemplate(
    ACTION_NAME,
    FILE_PATH.pagesPath + `/${fileName}/${fileName}.tsx`,
    fileName
  );
  copyTemplate(
    ACTION_NAME + 'Less',
    FILE_PATH.pagesPath + `/${fileName}/${fileName}.less`,
    fileName
  );
  fs.mkdirSync(FILE_PATH.pagesPath + `/${fileName}` + '/components');
}

function generateComponent(fileName, componentOptions) {
  const { basic, business } = componentOptions;
  if (basic) {
    generateComponentBasic(fileName);
  } else if (business) {
    generateComponentBusiness(fileName);
  }
}

function generateComponentBasic(fileName) {
  fileName = toUpperCaseFirstWord(fileName);
  fs.mkdirSync(FILE_PATH.componentsPath + '/Basic' + `/${fileName}`);

  copyTemplate(
    `componentBasic`,
    FILE_PATH.componentsPath + '/Basic' + `/${fileName}/${fileName}.tsx`,
    fileName
  );

  copyTemplate(
    'componentBasicLess',
    FILE_PATH.componentsPath + '/Basic' + `/${fileName}/${fileName}.less`,
    fileName
  );
}

function generateComponentBusiness(fileName) {
  fileName = toUpperCaseFirstWord(fileName);
  fs.mkdirSync(FILE_PATH.componentsPath + '/Business' + `/${fileName}`);
  copyTemplate(
    `componentBusiness`,
    FILE_PATH.componentsPath + '/Business' + `/${fileName}/${fileName}.tsx`,
    fileName
  );

  copyTemplate(
    'componentBusinessLess',
    FILE_PATH.componentsPath + '/Business' + `/${fileName}/${fileName}.less`,
    fileName
  );
}

function generate(options, actionName, fileName) {
  validate([
    {
      fn: () => !process.cwd().endsWith('/src'),
      message: '请在项目的 src 目录下运行！',
    },
    {
      fn: () => fileName.includes('-'),
      message: 'pages下文件必须以首字母大写+驼峰命名！',
    },
  ])(() => {
    if (actionName === ACTION_NAME) {
      //TODO:检查文件名是否重复
      generatePage(fileName);
    }
    if (actionName === 'component' || actionName === 'c') {
      // ag g component basic / business
      generateComponent(fileName, options);
    } else {
      console.log(`暂不支持 ${actionName} 命令`);
      return;
    }
  });
}

function initCommandGenerate(program) {
  program
    .command('generate')
    .alias('g')
    .description('generate a page/components/api')
    .option('-ba, --basic', '创建 basic components')
    .option('-bu, --business', '创建 business components')
    .action((options) => {
      generate(options, ...process.argv.slice(3)); // ag g component
    });
}

module.exports = initCommandGenerate;
