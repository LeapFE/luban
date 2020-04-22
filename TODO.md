### 添加 cache-loader 缓存编译结果，同时添加 thread-loader，提高编译时间。

[cache-loader](https://www.npmjs.com/package/cache-loader)
[thread-loader](https://www.npmjs.com/package/thread-loader)

### 支持资源的提前加载/获取 [preload-webpack-plugin](https://www.npmjs.com/package/preload-webpack-plugin)

### 支持构建多页应用

### 支持 public 文件夹，且该文件夹中的内容不会经过 webpack 处理

### 支持 CSS Modules, 针对所有 css/less/sass 文件

自动识别 CSS Modules 的使用，比如
``` javascript
// CSS Modules
import styles from './index.css';
import styles from './index.less';
import styles from './index.sass';

// 非 CSS Modules
import './index.css';
import './index.less';
import './index.sass';
```

### 支持 sass 预处理器

### 图片引用和 url 转换规则说明

### 内置集成 commitlint

### 内置工具 hooks（luban-hooks）
