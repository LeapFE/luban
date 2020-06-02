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


#### 如何发布 package
> 发布前需要确认所有包的版本都是一致的，且以 lerna.json 中的版本为准，且在仓库中有对应的版本 tag

发布内测版本: `npm run publish:next`
发布生产版本: `npm run publish:latest`

#### 强制为所有 package 推送新版本 force all packages to be versioned

`lerna version --conventional-commits --force-publish='*'`
此脚本默认在原有版本号上修改修订号，例如 @luban-cli/cli: 1.3.0 => 1.3.1

强制为所有 package 推送新的 next 版本
`lerna version --conventional-commits --force-publish='*' prepatch --preid next`
例如  @luban-cli/cli: 1.3.0 => 1.3.1-next.0

强制为所有 package 推送新的 alpha 版本
`lerna version --conventional-commits --force-publish='*' prepatch --preid alpha`
例如  @luban-cli/cli: 1.3.0 => 1.3.1-alpha.0

强制为所有 package 推送新的 beta 版本
`lerna version --conventional-commits --force-publish='*' prepatch --preid beta`
例如  @luban-cli/cli: 1.3.0 => 1.3.1-beta.0

强制为所有 package 推送新的 beta 或 alpha 或 next 版本
`lerna version --conventional-commits --force-publish='*' prerelease --preid beta`
例如 @luban-cli/cli: 1.3.1-beta.0 => 1.3.1-beta.1

prepatch 表示修改修订号，preminor 表示修改次版本号，premajor 表示修改主版本号
prerelease 表示推送新的 beta/alpha/next 版本 

[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
