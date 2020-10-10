const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const recast = require('recast');

function getSplitString(str, flag = '/') {
  const parent = str.slice(0, str.indexOf(flag));
  const child = str.slice(str.indexOf(flag) + 1);
  return { parent, child };
}

function toUpperCaseFirstWord(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// foo/bar => foo/Bar
function formatFileName(fileName) {
  const { parent, child } = getSplitString(fileName);
  return `${parent}/${toUpperCaseFirstWord(child)}`;
}

function transform(filePath, visitFn) {
  const code = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  const ast = recast.parse(code, {
    parser: require('recast/parsers/babel'), // recast 默认使用的 parser 为  esprima，处理不了 jsx
  });
  visitFn(ast);
  const result = recast.print(ast).code;
  fs.writeFileSync(path.join(process.cwd(), filePath), result);
}

function validate(conditions) {
  let res = true;
  for (const item of conditions) {
    if (item.fn()) {
      res = false;
      console.error(item.message);
    }
  }
  return (callback) => res && callback();
}

/**
 *
 *
 * @param {*} from 待复制文件路径
 * @param {*} to 待新建文件路径 指定一个路径 ./a/b/c/d.js 若d.js的父目录不存在，则递归创建
 * @param {*} content
 */
async function generateFile({
  from = '',
  to = '',
  data = {},
  callback = () => {},
}) {
  const rawContent = fs.readFileSync(from, 'utf-8');
  const content = Handlebars.compile(rawContent)(data);
  const pathArr = to.split('/');
  const file = pathArr[pathArr.length - 1];
  const dir = pathArr.slice(0, -1).join('/');
  const lastPath = dir + '/' + file;
  await dirExists(dir);
  callback();
  fs.writeFileSync(lastPath, content);
}

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
  let isExists = await getStat(dir);
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    //如果该路径存在但是文件，返回false
    return false;
  }
  //如果该路径不存在
  let tempDir = path.parse(dir).dir; //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await mkdir(dir);
  }
  return mkdirStatus;
}

module.exports = {
  getSplitString,
  toUpperCaseFirstWord,
  validate,
  formatFileName,
  transform,
  generateFile,
};
