### ~~babel 配置文件格式更换~~
> 将现有的 babel 配置文件 `.babelrc` 替换为 `babel.config.js` 

详见 https://babeljs.io/docs/en/config-files#configuration-file-types

### 添加 cache-loader 缓存编译结果，同时添加 thread-loader，提高编译时间。

[cache-loader](https://www.npmjs.com/package/cache-loader)
[thread-loader](https://www.npmjs.com/package/thread-loader)


### 将 preset.cssPreprocessor 更名为 cssTechnology 或者 cssSolution (可能存在破坏性更新🤔?)
styled-components 并不属于 css 预处理器的分类，而是 css-in-js 的分类
less 或者 styled-components 只能称之为 css 技术或者 css 解决方案
