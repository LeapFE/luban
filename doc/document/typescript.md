# TypeScript

Luban 创建的项目默认使用 [TypeScript](http://www.typescriptlang.org) 作为开发语言，为项目开发引入类型检查以提高代码可维护性。默认在 *src* 目录下不允许出现 *.js* 文件，可以配置 *tsconfig.json* 允许 *.js*/*.jsx* 文件参与类型检查与编译。更多配置参考查阅 [tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

同时在 *package.json* 的 `scripts` 字段添加了类型检查的脚本：
```json
{
  "scripts": {
    "compile": "tsc --noEmit --diagnostics",
  }
}
```

可以在终端中运行 `npm run compile` 检查项目代码中可能存在的编译错误以及诊断信息。

::: tip 🙋
借助 ==webpack-dev-server== 的 [overlay](https://webpack.js.org/configuration/dev-server/#devserveroverlay) 和 [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) 可以实现线程外的快速类型检查并将错误打印在浏览器端的页面上。
:::

查阅以下内容获取更多关于 TypeScript 的信息：
+ [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
+ [TypeScript Deep Dive中文版](https://jkchao.github.io/typescript-book-chinese/)
+ [Typescript Handbook中文版](https://zhongsp.gitbooks.io/typescript-handbook/)
+ [如何使用 TypeScript 开发 React 应用](https://react-typescript-cheatsheet.netlify.app/)
+ [TypeScript React Conversion Guide](https://github.com/microsoft/TypeScript-React-Conversion-Guide)
+ [TypeScript官方博客](https://devblogs.microsoft.com/typescript/)
+ [Interface vs Type in TypeScript](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c)
