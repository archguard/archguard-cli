const path = require('path');
const { generateFile } = require('../utils');

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

module.exports = {
  generateComponentBasic,
  generateComponentBusiness,
};
