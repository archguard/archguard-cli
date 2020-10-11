const path = require('path');
const fs = require('fs');
const { generateFile } = require('../utils');

function generatePage(parent, child) {
  generateFile({
    from: path.join(__dirname, '../templates/page.tsx'),
    to: path.join(process.cwd() + `/pages/${parent}/${child}/${child}.tsx`),
    data: {
      fileName: child,
    },
    callback() {
      fs.mkdirSync(
        path.join(process.cwd() + `/pages/${parent}/${child}/components`)
      );
    },
  });

  generateFile({
    from: path.join(__dirname, '../templates/page.less'),
    to: path.join(process.cwd() + `/pages/${parent}/${child}/${child}.less`),
    data: {
      fileName: child,
    },
  });
}

module.exports = {
  generatePage,
};
