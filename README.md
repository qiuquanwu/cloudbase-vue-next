# 云开发 Vue3插件

[云开发 Vue 插件](https://github.com/TencentCloudBase/cloudbase-vue) 是云开发官方维护的 Vue 插件，提供全局入口、Vue 逻辑组件等功能。

## 安装

```
npm install --save cloudbase-vue-next
```

------

## 使用

下面我们使用 `LoginState` 组件，来动态绑定当前页面的登录态。

- 页面初始化时，显示 `'未登录'`
- 之后我们调用[匿名登录](https://docs.cloudbase.net/authentication/
anonymous.html)，如果登录成功，则文案将变成 `'已登录'`

main.js
```js
import {createApp} from "vue"
import Cloudbase from "cloudbase-vue-next"
import App from "./App.vue"
const app = createApp(App)
app.use(Cloudbase, {
    env: "your-env-id",
    region: "your-env-region"
})
app.mount('#app');
```

App.vue
```html
<template>
  <div id="app">
    <h1>Hello world</h1>
    <LoginState v-slot="{ loginState }">
      <h1>{{ loginState ? "已登录" : "未登录" }}</h1>
    </LoginState>
    <button @click="callFn">调用云函数</button>
  </div>
</template>

<script>
export default {
  async created() {
    // 以匿名登录为例
    await this.$cloudbase
      .auth({ persistence: "local" })
      .anonymousAuthProvider()
      .signIn();
  },
  methods: {
    callFn() {
      this.$cloudbase
        .callFunction({
          name: "vue-echo",
          data: { meg: "Hello world" },
        })
        .then((res) => {
          const result = res.result; //云函数执行结果
          console.log(result);
        });
    },
  },
};
</script>
```
在setup中使用
```html
<template>
  <div id="app">
    <h1>Hello world</h1>
    <LoginState v-slot="{ loginState }">
      <h1>{{ loginState ? "已登录" : "未登录" }}</h1>
    </LoginState>
    <button @click="callFn">调用云函数</button>
  </div>
</template>

<script>
import { useCloud } from "cloudbase-vue-next"
import { onMounted } from "vue";
export default {
  setup() {
    let cloudbase;
    const callFn = () => {
      cloudbase
        .callFunction({
          name: "hello_world",
          data: { meg: "Hello world" },
        })
        .then((res) => {
          const result = res.result; //云函数执行结果
          console.log(result);
        });
    };
    onMounted(async () => {
      cloudbase = useCloud();
      await cloudbase
        .auth({ persistence: "local" })
        .anonymousAuthProvider()
        .signIn();
    });
    return {
      callFn,
    };
  },
};
</script>
```
--------

## Plugin API

### Vue.$cloudbase

可以在 Vue 组件的 `this.$cloudbase` 中，获取 Cloudbase 实例
```js
export default {
  data() {
    return {
      docs: []
    }
  },
  async created() {
    // 登录
    await this.$cloudbase.auth({ persistence: "local" }).signInWithTicket(ticket)
    // 数据库查询
    const queryResult = await this.$cloudbase.database().collection('test').where({}).get()
    this.docs = queryResult.data
  }
}
```
--------

## Components

| 组件 | 功能 |
| ---- | ---- |
| [LoginState](#loginstate) | 获取并绑定登录状态 |
| [DatabaseQuery](#databasequery) | 数据库查询 |
| [DatabaseWatch](#databasewatch) | 数据库实时推送 |
| [CloudFile](#cloudfile) | 获取云存储中的文件 |

### LoginState
获取登录状态

#### Props

暂无

#### Slots

| slot       | type                   | 描述         |
| ---------- | ---------------------- | ------------ |
| loginState | `null` or `LoginState` | 当前是否登录 |
| loading    | `boolean`              | 是否加载中   |

#### Example
```html
<LoginState v-slot="{ loginState, loading }">
  <p>{{ loading ? '加载中' : (loginState ? '已登录' : '没登录') }}</p>
</LoginState>
```

-------


### DatabaseQuery

数据库查询

#### Props

| prop       | type       | 描述                                             |
| ---------- | ---------- | ------------------------------------------------ |
| collection | `string`   | 集合名                                           |
| query      | `function` | 返回自定的查询条件，如 `_ => ({ foo: _.gt(2) })` |

#### Slot

| slot    | type              | 描述           |
| ------- | ----------------- | -------------- |
| docs    | `Array<doc>`      | 文档组成的数组 |
| loading | `boolean`         | 是否加载中     |
| error   | `null` or `Error` | 错误           |

#### Example
```html
<DatabaseQuery
  v-slot="{ docs, loading, error }"
  collection="messages"
  :query="_ => ({ timestamp: _.gt(1573635456709) })"
>
  <p v-for="{ text } in docs">
    {{ text }}
  </p>
</DatabaseQuery>
```

-------

### DatabaseWatch

数据库实时监听

#### Props

| prop       | type       | 描述                                             |
| ---------- | ---------- | ------------------------------------------------ |
| collection | `string`   | 集合名                                           |
| query      | `function` | 返回自定的查询条件，如 `_ => ({ foo: _.gt(2) })` |

#### Slot
| slot    | type              | 描述           |
| ------- | ----------------- | -------------- |
| docs    | `Array<doc>`      | 文档组成的数组 |
| loading | `boolean`         | 是否加载中     |
| error   | `null` or `Error` | 错误           |

#### Example
```html
<DatabaseWatch
  v-slot="{ docs, loading, error }"
  collection="messages"
  :query="_ => ({ timestamp: _.gt(1573635456709) })"
>
  <p v-for="{ text } in docs">
    {{ text }}
  </p>
</DatabaseWatch>
```

------


### CloudFile

根据 `FileID`，获取云存储文件的真实 URL

#### Props

| slot | type     | 描述                          |
| ---- | -------- | ----------------------------- |
| id   | `string` | 云存储 ID，形如 `cloud://...` |

#### Slot
| slot    | type              | 描述           |
| ------- | ----------------- | -------------- |
| url     | `string`          | 文件的真实 URL |
| loading | `boolean`         | 是否加载中     |
| error   | `null` or `Error` | 错误           |

#### Example

```html
<CloudFile
    id="cloud://file-cloud-path"
    v-slot="{ url, loading }"
>
  {{ url ? url : 'loading...' }}
</CloudFile>
```
