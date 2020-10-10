// 以下路径均相对于 src 路径
const path = require('path');

module.exports.MENU_PATH = './components/Business/Layouts/PageSider.tsx';
module.exports.ROUTER_PATH = '../.umirc.ts';

module.exports.FILE_OPERATION_PATH = {
  basicComponents: {
    targetDir: path.join(process.cwd() + '/components/Basic'), //目录
    fileOption: [
      {
        fileType: 'tsx',
        from: path.join(__dirname + '/templates/componentBasic'), //相对本项目src目录
        to: path.join(process.cwd() + '/components/Basic'), //相对于使用者 src 目录
      },
      {
        fileType: 'less',
        from: path.join(__dirname + '/templates/componentBasicLess'),
        to: path.join(process.cwd() + '/components/Basic'), //相对于使用者 src 目录
      },
    ],
  },
  businessComponents: {
    targetDir: path.join(process.cwd() + '/components/Business'), //目录
    fileOption: [
      {
        fileType: 'tsx',
        from: path.join(__dirname + '/templates/componentBusiness'), //相对本项目src目录
        to: path.join(process.cwd() + '/components/Business'), //相对于使用者 src 目录
      },
      {
        fileType: 'less',
        from: path.join(__dirname + '/templates/componentBusinessLess'),
        to: path.join(process.cwd() + '/components/Business'), //相对于使用者 src 目录
      },
    ],
  },
  page: {
    targetDir: path.join(process.cwd() + '/pages/Business'), //目录
    fileOption: [
      {
        fileType: 'tsx',
        from: path.join(__dirname + '/templates/componentBusiness'), //相对本项目src目录
        to: path.join(process.cwd() + '/components/Business'), //相对于使用者 src 目录
      },
      {
        fileType: 'less',
        from: path.join(__dirname + '/templates/componentBusinessLess'),
        to: path.join(process.cwd() + '/components/Business'), //相对于使用者 src 目录
      },
    ],
  },

  // basicComponents: [
  //   {
  //     fileType: 'tsx',
  //     template: path.join(__dirname + '/templates/componentBasic'), //相对本项目src目录
  //     target: path.join(process.cwd() + '/components/Basic'), //相对于使用者 src 目录
  //   },
  //   {
  //     fileType: 'less',
  //     template: path.join(__dirname + '/templates/componentBasicLess'),
  //     target: path.join(process.cwd() + '/components/Basic'), //相对于使用者 src 目录
  //   },
  // ],
  // businessComponents: [
  //   {
  //     from: './templates/componentBusiness',
  //     to: './components/Business', //相对于使用者 src 目录
  //   },
  // ],
};
