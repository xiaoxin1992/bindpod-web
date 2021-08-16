# bindpod-web   bindpod前端功能实现

## 依赖模块安装
```
yarn install
```

### 修改后端服务地址 config.js文件, 修改api变量
```shell
const config = {
    api: "http://192.168.50.69:8000",
    timeout: 3000
}

export default config
```

### 开发环境启动
```
yarn serve
```

### 编译文件, 编译后的文件在dist文件中，放入nginx中可以正常访问
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
