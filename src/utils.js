const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const fileObject = {};

function travel(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (file) {
    console.log('file: ', file);
    const pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

function toUpperCaseFirstWord(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function generateFileByTemplate(params) {
  const content = Handlebars.compile(template)(data);
  return content;
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

module.exports = {
  travel,
  toUpperCaseFirstWord,
  generateFileByTemplate,
  validate,
};
