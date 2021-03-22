# 单元测试

在 *src* 目录添加诸如 `**/*.test.{ts,tsx}` `**/*.spec.{ts,tsx}` 的文件都被视为单元测试用例文件，并在 *package.json* 的 `scripts` 字段添加了测试脚本：
```json
{
  "scripts": {
    "test": "jest",
    "test:update": "jest -u",
    "test:coverage": "jest --coverage --color",
  }
}
```

在终端运行 `npm run test` 可以查看所有测试用例是否通过，并对组件生成测试快照，可以运行 `npm run test:update` 来更新测试快照。

## 测试覆盖率

默认除了 *src/route*、*src/service*、 *src/models* 和 *src/typings* 不在收集测试覆盖率的范围，其他 *src* 目录中的文件都会在测试覆盖率收集的范围之内。

可以在终端运行 `npm run test:coverage` 来查看测试覆盖率。配置 *jest.config.js* 来更改测试覆盖率收集的范围以及其他测试行为。更多查阅 [jest](https://jestjs.io/)。

## 测试组件

Luban 默认使用 ==jest== + ==enzyme== 来测试组件和 custom hooks。查阅 [React Test Recipes](https://reactjs.org/docs/testing.html) 和 [enzyme](https://enzymejs.github.io/enzyme/) 获取更多关于组件单元测试的信息。

