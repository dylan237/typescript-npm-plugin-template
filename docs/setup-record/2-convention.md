# 如何為專案導入 conventional commit

- 透過 `commitlint` 進行 commit message 的檢查（lint）
- 搭配 `husky` 在建立 commit message 前就自動執行 commitlint
- 透過 `commitizen` 方便開發者建立符合 [conventional commit 規範](https://www.conventionalcommits.org/en/v1.0.0/)的 commit message
- 使用 `conventional-changelog` 根據 commit message 來產生 CHANGELOG 檔
- 使用 `standard version` 來同時更新版本號和產生 CHANGELOG 檔

## commitlint：檢查 commit message

commitlint 這套工具是用來作為 git commit 的 linter，並且可以搭配不同的 convention。

這裡選擇 [config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)，也就是需要依據 conventional commit 的規範來寫 commit message：

- `@commitlint/cli` 是用來執行 commitlint 的工具
- `@commitlint/config-conventional` 是根據 conventional commit 所建立的驗證規則，這些驗證規則會被 commitlint/cli 內的程式邏輯所讀取，校驗使用者的提交訊息是否符合該規範

### 安裝

```bash
# 安裝 commitlint-cli 和 config-conventional
yarn add -D @commitlint/cli @commitlint/config-conventional
```

### 指定校驗規則

在專案中建立 `commitlint.config.js` 並放入設定

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

建立好的檔案長這樣，未來讓 commitlint 以 config-conventional 規則進行提交訊息驗證

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

另外也可以新增其他自訂義規則覆蓋 config-conventional 既有規則，參考[文件](https://github.com/conventional-changelog/commitlint#config)

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ...
  },
}
```

### 使用

```bash
# 使用 commitlint
$ echo "add commitlint" | npx commitlint
# 如果這個 commit message 不符合規範的話，會跳出錯誤
> ✖   subject may not be empty [subject-empty]
> ✖   type may not be empty [type-empty]
```

## 搭配 Husky: commit 前調用檢查

和 ESlint 類似，如果不在 commit 或 push 調用檢查，commitlint 會變得形同虛設

```bash
yarn add -D husky
```

husky 這套工具可以讓開發者在不同的 git hook 執行不同的動作，例如在建立 commit 前（pre-commit）執行 ESLint 的檢查，如果檢查沒過就不能建立該次 commit。

這裡則是利用 husky 在 `commit-msg` 這個 git hook 去檢查 commit message 有沒有符合 conventional commit 的規範。

### 新增 `husky.config.js` 檔案

```js
module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
  },
```

### husky 的坑

husky 在成功安裝後，會在 `.git` 內新增 hooks 資料夾，若在安裝 husky 時，你的專案內還沒有 `.git` 資料夾 (還沒執行 git init)，那將會使 githook 沒辦法被觸發。
如果很不幸，你已經在 git init 前安裝了 husky，還是有解決辦法：

1. 刪除 husky

```bash
npm uninstall husky
# or
yarn remove husky
```

2. 刪除 .git 內的 hooks 資料夾
3. 重新安裝 husky (如果安裝同版本沒成功，可以試著安裝其他版本)

```bash
npm install -D husky
# or
yarn add -D husky
```

> 如果都沒辦法可以試著安裝舊版的husky `yarn add huskey@4.3.8`。

## commitizen：建立 commit message

commitizen 可以你快速生成符合規範的 commit，透過 CLI 問答交互的方式完成你的 commit message 提交。

- `commitizen` 主要程式碼
- `cz-conventional-changelog` 提交規範設定檔： 配合 commitlint 選擇了 conventional commit 規範，這邊也選擇對應的提交規範設定檔

### 全域安裝

安裝

```bash
yarn add -D commitizen cz-conventional-changelog -g
```

如果使用全域模式安裝的話需要在全域根目錄下建立 `.czrc` 文件,然後文件中輸入內容 `{ "path": "cz-conventional-changelog" }` 或者直接鍵入如下指令達到此效果

```bash
echo '{"path":"cz-conventional-changelog"}' > ~/.czrc
```

使用

```bash
git cz
```

### 專案內安裝

安裝

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

在 package.json 指定使用 cz-conventional-changelog 規則

```json
"config":{
  "commitizen":{
    "path":"node_modules/cz-conventional-changelog"
  }
}
```

之後要建立 commit 的話，只需要執行

```bash
npx cz
```

## conventional-changelog：建立 CHANGELOG (此 REPO 未使用)

在根據 conventional commit 來寫 commit message 後，我們還可以自動產生對應的 CHANGELOG 檔。這裡則會使用 [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)。

```bash
# npm 安裝
npm install --save-dev conventional-changelog-cli
# yarn 安裝
yarn add -D conventional-changelog-cli

# 查看可用指令
npx conventional-changelog --help

# 第一次產生 CHANGELOG，若已有 CHANGELOG 再執行一次則會被覆蓋
npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0

# 將新的更新 message 添加到 CHANGELOG
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

> 補充： 加上 `-p angular` 代表符合 conventional commits 規範的提交才會被新增至 CHANGELOG 裡，反之則是全部 commit 都會被添加

建立 package.json script，之後就只需要執行 `npm run changelog` 就會產生最新的 CHANGELOG 檔。

```
"scripts": {
  ...
  "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
},
```

## standard version：更新套件版本號

最後這套 [standard version](https://github.com/conventional-changelog/standard-version) 是在針對套件進行版號更新，並同時產生該次更新的 CHANGELOG 檔，也就是說不需要再額外使用上述 conventional-changelog 的工具。

> - 如果你產生 CHANGELOG 的時間都是在更新版本號時，且是使用 conventional commit 在建立 commit message 的話，則可以用 standard version 就好，不用再使用 conventional-changelog。

它會：

- 根據 conventional commit 的內容，依據 [semver](https://pjchender.dev/npm/npm-semver/) 的原則來更新版號
- 產生對應的 CHANGELOG

### semantic version(semver)#

- patch release：當套件只進行基本的 bugfix ，沒有新增什麼功能或特色，會增加最後一位的版本號時，1.0.1。
- minor release：當套件有增加 api 的一些功能，但不會影響到這個套件的整體使用，會增加中間的版本號，1.1.0。
- major release：新的 api 已經是無法向下兼容的，也就是在新版的套件中使用舊版的 API 可能會導致錯誤，這時候套件會增加最前面的版本號，2.0.0。

安裝

```bash
# npm
npm i --save-dev standard-version
# yarn
yarn add -D standard-version
```

指令

```bash
# 檢視所有可用的指令
npx standard-version --help

# 第一次 release
npx standard-version --first-release

# 更新套件版號和 CHANGELOG
npx standard-version

# 透過 dry-run 先看看會有什麼改變
npx standard-version --dry-run

# 更新到指定的版本
npx standard-version --release-as major|minor|patch # 指定更新版號
npx standard-version --release-as 1.1.0 # 指定更新後的版號
```

> 需要特別留意的是，當版號還在 v0.y.z，major 還沒進到 v1 是，會被視為是 pre-production 的產品，因此 feature 和 fix 都只會更新 patch version；breaking change 則只會更新 minor version。

建立 package.json script，之後就只需要執行 `npm run release`

```
"scripts": {
  ...
  "release": "standard-version"
},
```

## 補充 1 - lint-staged

上面 Husky 讓我們可以在 commit-msg hooks 時做一些事情，而 Lint-staged 則讓我們可以針對那些已經 git add 的 staged files 做事情。這兩者的組合能夠在我們真正 commit code 之前就檢查我們的程式碼是否符合一切規定。

安裝

```bash
yarn add -D lint-staged
```

之前我們已經可以在 `commit-msg` hook 進行 commitlint 檢查了，現在我希望在 `pre-commit` 這個 hook 時可以針對被 staged 的檔案進行 ESlint 檢查和 prettier 自動 format

```js
"hooks": {
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS', // 先觸發
  'pre-commit': 'lint-staged' // 後觸發
}
```

配置 `lint-staged.config.js`。
可以看到我們甚至可以指定路徑及檔案格式

```js
module.exports = {
  'src/**/*.{ts,tsx,js,jsx}': ['yarn lint'],
  '*.+(json|css|md)': ['prettier --write'],
}
```

## 補充 2 - ls-lint: 驗證專案資料夾及檔案名稱

[ls-lint](https://ls-lint.org/1.x/configuration/the-rules.html#overview) 可以幫助我們檢查專案內的檔案及資料夾名稱是否符合規範

安裝

```bash
yarn add -D @ls-lint/ls-lint
```

新增 `.ls-lint.yml` 檔案，自訂校驗規則

```yml
ls:
  src:
    .dir: camelCase
    .js: regex:index | camelCase
    .ts: regex:index | camelCase
  public:
    .html: camelCase
ignore:
  - .git
  - node_modules
  - .babelrc.js
  - .eslintrc.js
```

l 修改 lint-staged.js，使 lint-staged 可以觸發 ls-lint 驗證

```js
module.exports = {
  'src/**/*.{ts,tsx,js,jsx}': ['node_modules/.bin/ls-lint', 'yarn lint'],
  '*.+(json|css|md)': ['prettier --write'],
}
```

## 補充 3: 自定義 commitizen 提交規範

如果想自己定義提交規範也是行得通的。

### 安裝

```bash
yarn add -D commitlint-config-cz  cz-customizable
```

### 自訂義規範設定檔

新增 `cz-config.js` 檔案，自訂義 commit 規範，可參考[範例](https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js)

```js
module.exports = {
  types: [
    {
      value: 'feat',
      name: '✨  feat:      新功能',
    },
    {
      value: 'fix',
      name: '🐞  fix:       錯誤修復',
    },
    {
      value: 'docs',
      name: '🗒️   docs:      文件相關更改',
    },
    {
      value: 'refactor',
      name: '🛠   refactor:  無修復錯誤且無添加新功能的更改',
    },
    {
      value: 'perf',
      name: '🆙  perf:      提升效能的更改',
    },
    {
      value: 'test',
      name: '🏁  test:      增加測試或現有的測試更改',
    },
    {
      value: 'build',
      name: '🏭  build:     影響 build system 或是外部依賴的更改，如 npm、gulp..等',
    },
    {
      value: 'chore',
      name: '🗯   chore:     其他不會修改 src 或測試文件的更改',
    },
    {
      value: 'docs',
      name: '📚  docs:      文件相關',
    },
    {
      value: 'revert',
      name: '⏪  revert:    Revert a previous commit',
    },
    {
      value: 'WIP',
      name: '💪  WIP:       進行中尚未完成',
    },
  ],
  // message  驗證規則檔案: commitlint.config.js
  messages: {
    type: '[type] 更改的種類 (必填):',
    scope: '[scope] 更改的作用範圍 (可選):',
    customScope: '[customScope] Denote the SCOPE of this change (可選/小寫):',
    subject: '[subject] 標題 (必填):',
    body: '[body] 詳細描述 (使用 | 换行) (可選):',
    // 會讓舊版程式無法運行的更新
    breaking: '[breaking] Breaking Changes 描述 (可選):',
    footer: '[footer] 相關 issues 連結 (可選):',
    confirmCommit: '確認提交? (y/N)',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'chore'],
  subjectLimit: 100,
  skipQuestions: ['scope'],
  footerPrefix: '相關ISSUE:',
  scopes: [{ name: 'scope' }],
  scopeOverrides: {
    fix: [{ name: 'fix-scope' }],
  },
}
```

### 更改 package.json 設定，指定使用自訂規範

將 `cz-conventional-changelog` 改為 `cz-customizable`，之後使用 `npx cz` 指令就會跳出你所設定好的規範

```
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

### 更改 commitlint.config.js 設定

之前使用的 `cz-conventional-changelog` 提交規範 所對應的驗證規則是 `@commitlint/config-conventional`
那麼你現在已經定義了一套提交規範在 `.cz-config.js` 內了，你還需要根據你所設定的提交規範定義一套給它的驗證規則，而這些設定就是在 `commitlint.config.js` 中撰寫

之前的 `commitlint.config.js`：

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

改為：

```js
const getConfig = require('commitlint-config-cz/lib/config').get
const czConfig = require('./.cz-config')

const defaultConfig = {
  extents: ['cz'],
  // 補充：這裡的 rules 設定和 @commitlint/config-conventional 源碼是一樣的
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always'],
  },
}

const config = getConfig(czConfig, defaultConfig)

module.exports = config
```

1. 將 extends 改為 cz，替換掉舊的 `@commitlint/config-conventional` 驗證規則
2. rules 內讓使用者去定義的給 commitlint 讀取的驗證規則
3. getConfig 函數作用是將 `.cz-config.js` 中設定的的 types 注入至 defaultConfig.rules 陣列中的 `type-enum`，處理後陣列會由 `[2, 'always]` 變成 `[2, 'always', ['feat', 'fix', 'docs', ...]]`，即是添加那些你在 .cz-config.js 中定義的 types

## Reference

[[note] git conventional commit
](https://pjchender.dev/npm/note-git-conventional-commit/)
[自动化发布 npm 包及生成 Github Changelog](https://gist.github.com/banyudu/8825139c64a573a10a70ac5c6612f2f1)
