# 代码质量保障

Luban 内置 [ESLint](https://eslint.org/) 和 [Stylelint](https://stylelint.io/) 来帮助找出代码存在的潜在问题。同时搭配 [Prettier](https://prettier.io/) 来美化代码。

Luban 默认会将代码的 lint error 通过 ==webpack-dev-server== 的 [overlay](https://webpack.js.org/configuration/dev-server/#devserveroverlay) 打印在浏览器端的页面上，方便定位问题，如果需要配置此行为请查阅 [devServer](../config/README.md#devserver)。

在 *package.json* 的 `scripts` 字段中同时增加以下脚本：

```json
{
  "scripts": {
    "eslint": "eslint --config .eslintrc --ext .tsx,.ts src/",
    "eslint:fix": "eslint --fix --config .eslintrc --ext .tsx,.ts src/",
    "format:ts": "prettier --write 'src/**/*.{ts,tsx}'",
    "format:check:ts": "prettier --check 'src/**/*.{ts,tsx}'"
  }
}
```

用来检查或者修复代码中的潜在问题和代码格式化问题。同时也会设置 git hooks 来运行这些任务，具体查阅 [git hooks](cli-service.md#git-hooks)

::: tip 🙋
ESLint 的规则会与 Prettier 的规则产生冲突，具体可以查阅 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier#special-rules) 和 [using-prettier-with-eslint](https://prettier.io/docs/en/webstorm.html#using-prettier-with-eslint)
:::

## ESLinter

可以修改 *.eslintrc* 来配置 ESLint 的行为，支持三种 ESLint 配置：
+ [eslint-config-leapfe](https://www.npmjs.com/package/eslint-config-leapfe)
+ [eslint-config-airbnb](https://github.com/airbnb/javascript)
+ [eslint-config-standard](https://github.com/standard/eslint-config-standard)

其中，使用 TypeScript 作为开发语言时，ESLint 解析器使用 [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint#readme)，使用 JavaScript 时，解析器为 [babel-eslint](https://github.com/babel/babel-eslint)。同时也对 [React hooks 相关的 lint 规则](https://reactjs.org/docs/hooks-rules.html) 做了支持。


可以查阅以下资料获取更多信息:
+ [React specific linting rules for ESLint](https://github.com/yannickcr/eslint-plugin-react)
+ [Linting of  ES2015+ (ES6+) import/export syntax](https://github.com/benmosher/eslint-plugin-import)
+ [Additional ESLint's rules for Node.js](https://github.com/mysticatea/eslint-plugin-node#readme)
+ [Enforce best practices for JavaScript promises](https://github.com/xjamundx/eslint-plugin-promise#readme)
+ [Static AST checker for accessibility rules on JSX elements](https://github.com/evcohen/eslint-plugin-jsx-a11y#readme)
+ [clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript)

## StyleLinter

对样式代码进行 lint 是一个可选项。Luban 默认使用规则集 [standard shareable config](https://github.com/stylelint/stylelint-config-standard#readme) 帮助对 *css/less/sass* 文件代码找出潜在问题。可以运行以下脚本查看存在的问题:
```json
{
  "scripts": {
    "format:style": "prettier --write 'src/**/*.{css,less}'",
    "format:check:style": "prettier --check 'src/**/*.{css,less}'",
    "stylelint": "stylelint src/**/*.{css,less}",
  }
}
```

访问 [stylelint](https://stylelint.io/) 查阅更多信息。

## Prettier

可以更改 *.prettierrc* 文件来配置 [prettier](https://prettier.io/) 的行为。

默认的配置为：
```json
{
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always",
  "jsxBracketSameLine": false,
  "endOfLine": "lf",
  "proseWrap": "always"
}
```

::: tip 🙋
Luban 创建的项目默认使用双引号，若是需要配置单引号，除了配置 `singleQuote` 与 `jsxSingleQuote`, 还需要配置编辑器的行为，Visual Studio Code 查阅 [quote-style](https://code.visualstudio.com/updates/v1_24#_preferences-for-auto-imports-and-generated-code)，webstrom 查阅 [JavaScript and TypeScript tools](https://www.jetbrains.com/resharper/features/javascript_typescript.html)。 
:::

## commitizen 和 commitlint

为保障多人协作开发下代码提交的一致性和规范性，当在终端运行 `git commit` 时（并不需要 `-m` 参数），会在终端提供交互式的询问，以完成 commit message 的填写：

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1ggt8fzv9q3j31g20osn2o.jpg" alt="commit" style="zoom: 50%;" />


上图中 Luban 使用了 [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) 来生成规范化的提交消息。

同时，在生成 commit message 后，将会使用 [commitlint](https://commitlint.js.org/#/) 来校验 message 是否符合 *commitlint.config.js* 中约定的规则。详细的规则查阅 [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)。

最终这些任务都会在 *package.json* 的 `husky` 中指定的 hook 自动运行：
```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
    }
  },
}
```

### 手动添加 commitizen 和 commitlint

在 Luban@1.3.2 版本之前，创建项目时并没有 commitizen 和 commitlint，可以通过以下步骤来添加：

1. 安装相关的依赖：
```shell
npm i @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog --save-dev
```

2. 添加 *commitlint.config.js*:
```shell
echo 'module.exports = { extends: ["@commitlint/config-conventional"] };' > commitlint.config.js
```

3. 在 *package.json* 添加 husky hook 和 commitizen adapter:
```package.json{2,3,4,5,6,10,11}
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
    }
  }
}
```

这样，就可以通过 `git add <pathspec> [OPTION]` => `git commit` => `git push <repository> <refspec> [OPTION]` 将代码变更同步到远端仓库。
