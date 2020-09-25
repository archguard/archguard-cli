const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

function getSplitString(str, flag = '/') {
  const parent = str.slice(0, str.indexOf(flag));
  const child = str.slice(str.indexOf(flag) + 1);
  return { parent, child };
}

function toUpperCaseFirstWord(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function generateFileByTemplate(template, data) {
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
  getSplitString,
  toUpperCaseFirstWord,
  generateFileByTemplate,
  validate,
};
