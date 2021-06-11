# 状态管理

Luban 默认使用 [rematch](https://rematchjs.org/) 来管理全局的状态，==rematch== 是一个构建在 [redux](https://redux.js.org/) 之上的优秀的状态管理工具。

### 启用状态管理
配置 *src/index.tsx* `run` 方法参数对象的 `models` 字段就可以开启状态管理，不过在开启之前，需要先创建一些 models。

1. 创建 *models* 目录
```shell
mkdir -p src/models
touch src/models/index.ts
touch src/models/count.ts
```

2. 创建 model
```ts
// src/models/count.ts
import { createModel } from "@rematch/core"
import { RootModel } from "./index";

interface CountState {
  count: number;
}

export const count = createModel<RootModel>()({
  state: { count: 0 } as CountState,
  reducers: {
    increment(state, payload: number) {
      return { count: state.count + payload };
    },
  },
  effects: (dispatch) => ({
    incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
    },
  }),
});
```

3. 定义类型(RootModel,Dispatch,RootState)
```ts
// src/models/index.ts
import { Models, RematchDispatch, RematchRootState } from "@rematch/core";

import { count } from "./count";

export interface RootModel extends Models<RootModel> {
  count: typeof count;
}
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const models: RootModel = { count };
```

4. 开启状态管理
```ts{6}
// src/index.tsx
import { models } from "./models";

export default run({
  route,
  models: models,
});
```

::: tip
当修改了 *src/index.tsx* 后，本地服务会自动重启，重启后就可以在组件中更新和使用这些全局状态了。
:::

5. 在组件中使用
```tsx
import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/models";

const Count: FunctionComponent = () => {
  const count = useSelector((state: RootState) => state.count);
  const dispatch = useDispatch<Dispatch>();

  return (
    <div>
      <p>{count.count}</p>
      <button onClick={() => dispatch }>increment</button>
    </div>
  );
};

export { Count };
```