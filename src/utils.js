const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = {
  toUpperCaseFirstWord(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
  },
  generateFileByTemplate(template, data) {
    const content = Handlebars.compile(template)(data);
    return content;
  },
  travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
      const pathname = path.join(dir, file);

      if (fs.statSync(pathname).isDirectory()) {
        travel(pathname, callback);
      } else {
        callback(pathname);
      }
    });
  },
};
