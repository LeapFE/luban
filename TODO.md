### ~~babel 配置文件格式更换~~
> 将现有的 babel 配置文件 `.babelrc` 替换为 `babel.config.js` 

详见 https://babeljs.io/docs/en/config-files#configuration-file-types

### 添加 cache-loader 缓存编译结果，同时添加 thread-loader，提高编译时间。

[cache-loader](https://www.npmjs.com/package/cache-loader)
[thread-loader](https://www.npmjs.com/package/thread-loader)

### 添加特性 unit test

如何测试 [react hooks?](https://react-hooks-testing-library.com/)

[测试快照Snapshot Testing](https://jestjs.io/docs/en/snapshot-testing) 使用 [enzyme-to-json](https://www.npmjs.com/package/enzyme-to-json) 将 Enzyme 容器转换为与 Jest 快照测试兼容的格式。

[Babel7 or TypeScript?](https://kulshekhar.github.io/ts-jest/user/babel7-or-ts) TypeScript 使用 [ts-jest](https://www.npmjs.com/package/ts-jest) 转换 TypeScript 代码以支持 Jest 测试；JavaScript 使用 [babel-jest](https://www.npmjs.com/package/babel-jest) 转换 JavaScript 代码以支持 Jest 测试。

#### typescript

1. 添加 *tests* 文件夹，包括一个 *fileMock.js* 、*styleMock.js* 以及和一个 *setup.js*  文件
   + *fileMock.js* 文件，图片、字体以及媒体资源等的模块名将映射到此文件。对应 *jest.config.js* 中的 `moduleNameMapper`

     ```javascript
     // fileMock.js
     module.exports = {};
     ```

   + *styleMock.js* 文件，css 和 less 文件的模块名将映射到此文件。对应*jest.config.js* 中的 `moduleNameMapper`

     ```javascript
     // styleMock.js
     module.exports = {};
     ```

   + *setup.js* 文件，jest 设置完成环境变量后将要调用的设置文件。对应 *jest.config.js* 中的 `setupFilesAfterEnv`

     ```javascript
     // setup.js
     const Enzyme = require("enzyme");
     const Adapter = require("enzyme-adapter-react-16");
     
     Enzyme.configure({ adapter: new Adapter() });
     ```

2. 在 *.eslintrc* 配置文件中，
  
   1. 环境变量 `env` 字段添加 `jest`，允许全局使用 `describe`、`it`、`expect` 等。
   2. 在规则中添加一项 `"import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"] }]`
   
3. 在 *.eslintignore* 中添加 *jest.config.js* */tests/***,  忽略对 jest 相关配置文件的 lint。

4. 在 *package.json* 中添加脚本命令
   1. `"test": "jest"` 运行单元测试（run all unit tests）
   2. `"test:update": "jest -u"` 重新生成快照（re-record every snapshot that fails during this test run）
   3. `"test:coverage": "jest --coverage --color"` 查看测试覆盖率信心并输出报告(Indicates that test coverage information should be collected and reported in the output)

5. 安装依赖
   1. 开发依赖：
      + `"@types/enzyme": "^3.10.5"`
      + `"@types/enzyme-adapter-react-16": "^1.0.6"`
      + `"@types/jest": "^25.1.4"`
      + `"enzyme": "^3.11.0"`
      + `"enzyme-adapter-react-16": "^1.15.2"`
      + `"jest": "^25.1.0"` 
      + `"ts-jest": "^25.2.1"`
      + `"@types/enzyme-to-json": "^1.5.3"`
   + `"enzyme-to-json": "^3.4.4"`
   2. 生成依赖：无
   
7. 添加 *jest.config.js* 文件

   ```javascript
   module.exports = {
     // 使用 ts-jest 的 preset 处理 ts
     preset: "ts-jest",
     setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
     // NOTE dist 文件夹名称应该根据 luban.config.js 中的 outputDir 决定
     transformIgnorePatterns: ["/node_modules/", "/dist/"],
     moduleNameMapper: {
       "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
         "<rootDir>/tests/fileMock.js",
       "\\.(css|less)$": "<rootDir>/tests/styleMock.js",
     },
     testPathIgnorePatterns: ["**/node_modules/**", "**/dist/**", "/src/router/", "/src/models/"]
     // NOTE dist 文件夹名称应该根据 luban.config.js 中的 outputDir 决定
     collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/node_modules/**", "!**/dist/**"],
     coveragePathIgnorePatterns: ["/node_modules/", "/src/router/", "/src/models/"],
   };
   ```


#### javascript
1. 添加 *tests* 文件夹，包括一个 *fileMock.js* 、*styleMock.js* 以及和一个 *setup.js*  文件
   + *fileMock.js* 文件，图片、字体以及媒体资源等的模块名将映射到此文件。对应 *jest.config.js* 中的 `moduleNameMapper`

     ```javascript
     // fileMock.js
     module.exports = {};
     ```

   + *styleMock.js* 文件，css 和 less 文件的模块名将映射到此文件。对应*jest.config.js* 中的 `moduleNameMapper`

     ```javascript
     // styleMock.js
     module.exports = {};
     ```

   + *setup.js* 文件，jest 设置完成环境变量后将要调用的设置文件。对应 *jest.config.js* 中的 `setupFilesAfterEnv`

     ```javascript
     // setup.js
     const Enzyme = require("enzyme");
     const Adapter = require("enzyme-adapter-react-16");
     
     Enzyme.configure({ adapter: new Adapter() });
     ```

2. 在 *.eslintrc* 配置文件中，
  
   1. 环境变量 `env` 字段添加 `jest`，允许全局使用 `describe`、`it`、`expect` 等。
   2. 在规则中添加一项 `"import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"] }]`
   
3. 在 *.eslintignore* 中添加 *jest.config.js* */tests/***,  忽略对 jest 相关配置文件的 lint。

4. 在 *package.json* 中添加脚本命令
   1. `"test": "jest"` 运行单元测试（run all unit tests）
   2. `"test:update": "jest -u"` 重新生成快照（re-record every snapshot that fails during this test run）
   3. `"test:coverage": "jest --coverage --color"` 查看测试覆盖率信心并输出报告(Indicates that test coverage information should be collected and reported in the output)

5. 安装依赖
   1. 开发依赖：
      + `"enzyme": "^3.11.0"`
      + `"enzyme-adapter-react-16": "^1.15.2"`
      + `"jest": "^25.1.0"` 
      + `"babel-jest": "^25.1.0"`
      + `"enzyme-to-json": "^3.4.4"`
   2. 生成依赖：无
   
7. 添加 *jest.config.js* 文件

   ```javascript
   module.exports = {
     transform: {
       "^.+\\.jsx?$": "babel-jest"
     },
     setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
     // dist 文件夹名称应该根据 luban.config.js 中的 outputDir 决定
     transformIgnorePatterns: ["/node_modules/", "/dist/"],
     moduleNameMapper: {
       "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
         "<rootDir>/tests/fileMock.js",
       "\\.(css|less)$": "<rootDir>/tests/styleMock.js",
     },
      testPathIgnorePatterns: ["**/node_modules/**", "**/dist/**", "/src/router/", "/src/models/"]
     // dist 文件夹名称应该根据 luban.config.js 中的 outputDir 决定
     collectCoverageFrom: ["src/**/*.{js,jsx}", "!**/node_modules/**", "!**/dist/**"],
     coveragePathIgnorePatterns: ["/node_modules/", "/src/router/", "/src/models/"],
   };
   ```



### 添加特性 data fetch

使用 [axios](https://www.npmjs.com/package/axios) 和 [useRequest]() 从服务端获取数据再展示到视图中

#### TypeScript



#### JavaScript





