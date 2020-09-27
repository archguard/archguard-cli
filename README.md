# arch-guard-cli
arch-guard 前端项目脚手架

# 为什么需要该脚手架？
- 保持代码规范性
- 减少手动新建文件操作，快速生成符合项目风格的代码，提高开发体验

## TODO
 - [x] 自动生成 page 文件模板
 - [x] 自动生成 组件 文件模板
 - [x] 自动生成 路由配置
 - [x] 自动生成 菜单配置
 - [ ] 打包
 - [ ] 插件架构
 - [ ] 测试
 - [ ] 搭建流水线

## 使用
```bash
npm install arch-guard-cli -g
```

## 常用命令(必须在项目的**src**目录下运行)
- 创建页面：`ag g page Demo`
- 创建基础组件：`ag g c -ba (ag generate component --basic)`
- 创建业务组件：`ag g c -bu (ag generate component --business)`

<img src="./assets/创建页面.gif" />

## 常用缩写
- `generate => g`
- `component => c` 
- `--basic => -ba`
- `--business => -bu`
 

