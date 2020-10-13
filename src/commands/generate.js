const {
  generateComponentBasic,
  generateComponentBusiness,
  generateComponentPage,
} = require('../generators/component');
const { generatePage } = require('../generators/page');
const menuTransformer = require('../transformer/menu');
const routerTransformer = require('../transformer/router');
const {
  getSplitString,
  formatFileName,
  toUpperCaseFirstWord,
  error,
} = require('../utils');
/**
 * @param {*} pathArg 路径参数 例如 xxx/xxx2
 * @param {*} menuName 菜单显示文本 例如 主页
 */
function pageHandler(pathArg, menuName) {
  pathArg = formatFileName(pathArg);
  let { parent, child } = getSplitString(pathArg);
  if (!parent || !child) {
    console.error('分隔符前、后不能为空字符！');
    return;
  }
  generatePage(parent, child);
  routerTransformer(pathArg);
  menuTransformer(pathArg, menuName);
}

function componentHandler(fileName, componentOptions) {
  fileName = toUpperCaseFirstWord(fileName);
  const { basic, business } = componentOptions;
  const isPageComponent = !basic & !business; //不是在 src/components 生成组件，而是在普通页面文件生成组件
  if (isPageComponent) {
    generateComponentPage(fileName);
  } else {
    if (!process.cwd().endsWith('src')) {
      error('请在项目的 src 目录下运行！');
    }
    if (basic) {
      generateComponentBasic(fileName);
    } else if (business) {
      generateComponentBusiness(fileName);
    }
  }
}

function generate(options, actionName, fileName, menuName) {
  switch (actionName) {
    case 'page':
    case 'p':
      if (!process.cwd().endsWith('src')) {
        error('请在项目的 src 目录下运行！');
      }
      if (fileName.includes('-')) {
        error('pages下文件必须以首字母大写+驼峰命名！');
      }
      if (!fileName.includes('/')) {
        error(
          '目前新建页面必须指定父级目录，以 / 分割 ,例如 parentDirectory/childDirectory'
        );
      }
      if (!menuName) {
        error('请设置最后一个参数为菜单名 例如： ag g page xxx/xxx2 首页');
      }

      pageHandler(fileName, menuName);
      break;

    case 'component':
    case 'c':
      componentHandler(fileName, options);
      break;

    default:
      break;
  }
}

function initCommandGenerate(program) {
  // ag g page xxx/xxx2 菜单名
  program
    .command('generate')
    .alias('g')
    .description('generate a page/components/api')
    .option('-ba, --basic', '创建 basic components')
    .option('-bu, --business', '创建 business components')
    .action((options) => {
      generate(options, ...process.argv.slice(3));
    });
}

module.exports = initCommandGenerate;
