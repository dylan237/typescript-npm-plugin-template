## 使用 webpack 打包 TS

1. 新增入口檔 main.ts

```ts
document.write('Hello')
```

2. 新增 public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>webpack & TS</title>
  </head>
  <body></body>
</html>
```

3. build/webpack.config.js

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: './src/main.ts',
  },

  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash:8].js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [resolve('src')],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({}),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  devtool: isProd ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',

  devServer: {
    host: 'localhost',
    stats: 'errors-only',
    port: 8081,
    open: true,
  },
}
```

4. 導入 npm

```bash
npm init
```

5. 打包指令

```
"dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js",
"build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
```

6. 下載依賴包

```bash
yarn add -D typescript
yarn add -D webpack@4.41.5 webpack-cli@3.3.10
yarn add -D webpack-dev-server
yarn add -D html-webpack-plugin clean-webpack-plugin
yarn add -D ts-loader
yarn add -D cross-env
```

## ESlint + prettier

### References:

- https://github.com/forthealllight/blog/issues/45
- http://zendei.com/article/96531.html
- https://blog.panyanbin.com/archives/category/front-end/eslint

### ESlint

```bash
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-standard
```

這三個依賴分別是：

- `eslint`: ESLint 的核心
- `@typescript-eslint/parser`： ESLint 的解析器，用於解析 typescript，從而檢查和規範 Typescript 程式碼
- `@typescript-eslint/eslint-plugin`：這是一個 ESLint 插件，包含了各類定義好的檢測 Typescript 程式碼的規範

安裝好這 3 個依賴包之後，在根目錄下新建 `.eslintrc.js`，該文件中定義了 ESLint 的基礎配置，一個最為簡單的配置如下所示：

```js
module.exports = {
  parser: '@typescript-eslint/parser', //定義 ESLint 的解析器
  extends: ['plugin:@typescript-eslint/recommended'], //定義文件繼承的子規範
  plugins: ['@typescript-eslint'], //定義了該 ESlint 文件所依賴的插件
  env: {
    //指定程式碼的運行環境
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
}
```

- 在 TS 項目中必須執行解析器為 @typescript-eslint/parser，才能正確的檢測和規範 TS 程式碼
- env 環境變量配置，形如 console 屬性只有在 browser 環境下才會存在，如果沒有設置支持 browser,那麼可能報 console is undefined 的錯誤。

### 支援 airbnb 規則

> npm resource - [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript)

```bash
yarn add -D eslint-config-airbnb-typescript
```

使用 `eslint-config-airbnb-typescript` 還需下載以下依賴包：

需支援 react：

- eslint-plugin-import@^2.22.0
- eslint-plugin-jsx-a11y@^6.3.1
- eslint-plugin-react@^7.20.3
- eslint-plugin-react-hooks@^4.0.8
- @typescript-eslint/eslint-plugin@^4.4.1

```bash
yarn add -D eslint-plugin-import@^2.22.0 eslint-plugin-jsx-a11y@^6.3.1 eslint-plugin-react@^7.20.3 eslint-plugin-react-hooks@^4.0.8 @typescript-eslint/eslint-plugin@^4.4.1yar
```

不需支援 react：

- eslint-plugin-import@^2.22.0
- @typescript-eslint/eslint-plugin@^4.4.1

```bash
yarn add -D @typescript-eslint/eslint-plugin@^4.4.1 eslint-plugin-import@^2.22.0
```

然後修改 `.eslintrc.js`

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript']
  ...
}
```

### Prettier

```bash
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

其中：

- `prettier：` prettier 插件的核心
- `eslint-config-prettier`： 解決 ESLint 中的樣式規範和 prettier 中樣式規範的衝突，以 prettier 的樣式規範為準，使 ESLint 中的樣式規範自動失效
- `eslint-plugin-prettier`： 將 prettier 作為 ESLint 規範來使用

然後在根目錄下創建 `.prettierrc.js` 文件：

```js
module.exports = {
  printWidth: 120,
  semi: false,
  singleQuote: true,
  bracketSpacing: false,
  jsxBracketSameLine: true,
  arrowParens: 'avoid',
  tabWidth: 4,
  useTabs: false,
}
```

接著修改 .eslintrc.js 文件，引入 prettier：

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
}
```

#### VScode 集成

為了開發方便我們可以在 VSCode 中集成 ESLint 的配置，使得程式碼在保存或者程式碼變動的時候自動進行 ESLint 的 fix 過程。

首先需要安裝 VSCode 的 ESLint 插件，安裝插件完畢後，在 settings.json 文件中修改其配置文件為：

```json
{
  "eslint.enable": true, //是否開啟 vscode 的 eslint
  "eslint.autoFixOnSave": true, //是否在保存的時候自動fix eslint
  "eslint.options": {
    //指定 vscode 的 eslint 所處理的文件的後綴
    "extensions": [".js", ".vue", ".ts", ".tsx"]
  },
  "eslint.validate": [
    //確定校驗準則
    "javascript",
    "javascriptreact",
    "html",
    "vue",
    "typescript",
    "typescriptreact"
  ]
}
```
