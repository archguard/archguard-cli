const fs = require('fs');
const path = require('path');
const menuTransformer = require('../transformer/menu');
const routerTransformer = require('../transformer/router');

const {
  generateFileByTemplate,
  validate,
  getSplitString,
  formatFileName,
  toUpperCaseFirstWord,
  generateFile,
} = require('../utils');

/**
 * @param {*} pathArg 路径参数 例如 xxx/xxx2
 * @param {*} menuName 菜单显示文本 例如 主页
 */
function generatePage(pathArg, menuName) {
  if (!pathArg.includes('/')) {
    console.error(
      '目前新建页面必须指定父级目录，以 / 分割 ,例如 parentDirectory/childDirectory'
    );
    return;
  } else {
    pathArg = formatFileName(pathArg);
    let { parent, child } = getSplitString(pathArg);
    if (!parent || !child) {
      console.error('分隔符前、后不能为空字符！');
      return;
    }
    if (!menuName) {
      console.error(
        '请设置最后一个参数为菜单名 例如： ag g page xxx/xxx2 首页'
      );
      menuName = pathArg;
    }

    generateFile({
      from: path.join(__dirname, '../templates/page.tsx'),
      to: path.join(process.cwd() + `/pages/${parent}/${child}/${child}.tsx`),
      data: {
        fileName: child,
      },
    });

    generateFile({
      from: path.join(__dirname, '../templates/page.less'),
      to: path.join(process.cwd() + `/pages/${parent}/${child}/${child}.less`),
      data: {
        fileName: child,
      },
    });

    routerTransformer(pathArg);
    menuTransformer(pathArg, menuName);
  }
}

function generateComponent(fileName, componentOptions) {
  fileName = toUpperCaseFirstWord(fileName);
  const { basic, business } = componentOptions;
  if (basic) {
    generateComponentBasic(fileName);
  } else if (business) {
    generateComponentBusiness(fileName);
  }
}

function generateComponentBasic(fileName) {
  generateFile({
    from: path.join(__dirname, '../templates/componentBasic.tsx'),
    to: path.join(
      process.cwd() + `/components/Basic/${fileName}/${fileName}.tsx`
    ),
    data: {
      fileName,
    },
  });

  generateFile({
    from: path.join(__dirname, '../templates/componentBasic.less'),
    to: path.join(
      process.cwd() + `/components/Basic/${fileName}/${fileName}.less`
    ),
    data: {
      fileName,
    },
  });
}

function generateComponentBusiness(fileName) {
  generateFile({
    from: path.join(__dirname, '../templates/componentBusiness.tsx'),
    to: path.join(
      process.cwd() + `/components/Business/${fileName}/${fileName}.tsx`
    ),
    data: {
      fileName,
    },
  });

  generateFile({
    from: path.join(__dirname, '../templates/componentBusiness.less'),
    to: path.join(
      process.cwd() + `/components/Business/${fileName}/${fileName}.less`
    ),
    data: {
      fileName,
    },
  });
}

function generate(options, actionName, fileName, menuName) {
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
        generatePage(fileName, menuName);
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
