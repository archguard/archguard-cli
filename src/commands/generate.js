const fs = require('fs');
const path = require('path');

const {
  toUpperCaseFirstWord,
  generateFileByTemplate,
  validate,
} = require('../utils');

function copyTemplate(from, to, fileName) {
  from = path.join(__dirname, '../templates', from);
  const rawContent = fs.readFileSync(from, 'utf-8');
  const finalContent = generateFileByTemplate(rawContent, {
    fileName,
  });
  fs.writeFileSync(to, finalContent);
}

/**
 *
 *
 * @param {*} templateFileName componentBasic | componentBusiness | page
 * @param {*} fileName
 * @param {*} filePath './pages' | './components'
 */
function createFile(templateFileName, filePath, fileName) {
  fileName = toUpperCaseFirstWord(fileName);
  fs.mkdirSync(filePath + `/${fileName}`);
  copyTemplate(
    templateFileName,
    filePath + `/${fileName}/${fileName}.tsx`,
    fileName
  );
  copyTemplate(
    templateFileName + 'Less',
    filePath + `/${fileName}/${fileName}.less`,
    fileName
  );
}

function generatePage(fileName) {
  createFile('page', './pages', fileName);
  fs.mkdirSync('./pages' + `/${fileName}` + '/components');
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
  createFile('componentBasic', './components/Basic', fileName);
}

function generateComponentBusiness(fileName) {
  createFile('componentBusiness', './components/Business', fileName);
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
    switch (actionName) {
      case 'page':
      case 'p':
        generatePage(fileName);
        break;

      case 'component':
      case 'c':
        generateComponent(fileName, options);
        break;

      default:
        break;
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
