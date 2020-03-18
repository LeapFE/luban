#### 如何在目录 @luban 下创建一个 package
1. `lerna create @luban/<package>`

#### 将目录 @luban 下的一个 package 作为另外一个 package 的依赖
1. `yarn workspace <package> add <another_package>@0.0.1`
这里被依赖的 package 要表明版本号

#### 添加全局依赖
1. `yarn add -W -D <package_name>`

#### 为目录 @luban 下的某一个 package 添加依赖(默认为生产依赖)
1. `yarn workspace <package> add <package_name>@version`

使用 -D 参数添加开发依赖 `yarn workspace <package> add <package_name>@version -D`

#### 如何提交代码到远端仓库
1. `git add -- .`
2. `yarn run commit`
3. `git push`

⚠️ `yarn run commit` 之前运行单元测试(`yarn run test:changed`)和对 TypeScript 代码进行类型检查(`yarn run check:type:changed`)


#### 如何发布版本
1. `npm run publish`
