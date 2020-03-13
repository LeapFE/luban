# HTML 和静态资源

## HTML

### Index 文件

根目录 *template/index.html* 是默认的被 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 使用的模板文件，在构建时，会将资源自动注入该文件中。

## 处理静态资源

### 静态资源(图片/字体/音视频)处理

在 `cli-plugin-service` 中，通过 `file-loader` 用版本哈希值和正确的公共基础路径来决定最终的文件路径，再用 `url-loader` 将小于 4kb 的资源内联，以减少 HTTP 请求的数量。可以在 *luban.config.js* 中配置 `assetsLimit` 来修改默认的内联文件大小限制。

``` javascript
// luban.config.js
module.exports = {
  // 10kb
  assetsLimit: 10240,
};
```
