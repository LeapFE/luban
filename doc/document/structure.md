# 目录结构

Luban 默认创建的目录结构提供了良好的分层结构，约定的目录结构如下(以 TypeScript 为例)：

``` txt
.
├── .browserslistrc      # browserlist 配置文件
├── .editorconfig        # 编辑器配置文件
├── .env                 # 作用于所有环境的环境变量
├── .env.development     # 作用于开发(development)环境的环境变量
├── .env.production      # 作用于生产(production)环境的环境变量
├── .eslintignore        # 配置哪些文件或目录被 eslint 忽略
├── .eslintrc            # eslint 配置文件
├── .gitignore           # 配置哪些文件或目录不参与版本管理
├── .postcssrc           # postcss 配置文件
├── .prettierignore      # 配置哪些文件或目录被 prettier 忽略
├── .prettierrc          # prettier 配置文件
├── .stylelintrc         # stylelint 配置文件
├── README.md            # 项目说明
├── babel.config.js      # babel 配置文件
├── jest.config.js       # jest 配置文件
├── luban.config.js      # luban 配置文件
├── package.json
├── src                  # 源代码存在目录
│   ├── App.tsx            # 应用根组件
│   ├── assets             # 图片、字体以及视频等资源的存放目录
│   ├── components         # 应用公共组件
│   ├── constants          # 公共常量
│   ├── hooks              # 公共 hooks
│   ├── index.tsx          # 应用入口文件
│   ├── models             # 应用全局状态
│   ├── route              # 路由配置
│   ├── service            # 接口请求相关
│   │   ├── api              # 具体接口请求函数
│   │   ├── env.ts           # 导出被注入的环境变量
│   │   ├── interface        # 请求接口入参与返回类型
│   │   └── request.ts       # 请求实例
│   ├── style              # 公共样式
│   ├── types              # 公共类型
│   ├── typings            # 自定义模块类型
│   ├── utils              # 工具函数
│   └── views              # 页面组件
├── template
│   └── index.html       # 模板文件
├── tests                # 测试相关启动文件
└── tsconfig.json        # typescript 配置文件
```
