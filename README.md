# ArchGuard CLI

ArchGuard 前端项目脚手架

# 为什么需要该脚手架？

- 保持代码规范性
- 减少手动新建文件操作，快速生成符合项目风格的代码，提高开发体验

## 使用

```bash
npm install @archguard/cli -g
```

## 常用命令(必须在项目的**src**目录下运行)

- 创建页面：`ag g p systemEvaluation/Demo 页面菜单名`
> 上述命令会在 `pages/systemEvaluation`文件夹下新建`Demo`页面，并且自动配置好`路由`和`菜单`（菜单名设置为最后一个参数：页面菜单名）
- 创建基础组件：`ag g c 组件名 -ba `
- 创建业务组件：`ag g c 组件名 -bu `
- 在当前目录下创建组件：`ag g c 组件名`

## 常用缩写

- `g =>  generate`
- `c => component` 
- `-ba => --basic `
- `-bu => --business`

## 调试

在本项目路径下执行

```bash
npm link
```

License
---

@ 2020~ Thoughtworks.  This code is distributed under the MPL license. See `LICENSE` in this directory.
