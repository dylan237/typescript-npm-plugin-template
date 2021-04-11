## Supports

- TypeScript
- Using commitlint to comply with Conventional-commits specification
- ls-lint
- ESlint airbnb
- Prettier
- Zero bundle configurations with microbundle
- Only single release command to automatically to generate changelog file and sync it to your Github repo and publish your project to NPM

## Commands

- Submit commits

```bash
npx cz
```

- Will re-build when source files change

```bash
npm run dev
```

- Bundle "source" to "main"

```bash
npm run build
```

- Deploy to Github and publish to NPM registry simultaneously

```bash
npm run release
```

## Initialization

- 確認 package.json 資訊
  - 確認版本號為 0.0.0
  - 更新專案相關資訊，作者、repo url、專案名稱、專案描述 etc..

## How to release

- 產生第一個 changelog 執行 `yarn gen-changelog`
- 發布前預覽 `npx standard-version --dry-run`，這個指令可以先預覽發布後的版號及 CHANGELOG 相關訊息
- 發布版本的兩種方式
  1. `npm run release -r major|minor|patch` ( 指定升級方法 )
  2. `npm run release` ( standard-version 套件會透過 [semver 規則](https://semver.org/lang/zh-TW/)，並根據你新增的 commits 類型決定升級後的版號 )
  - 💡 `-b` 參數可以指定發布分支，預設是 `master`
- 執行發布指令後，CHANGELOG 會更新，並開一個版號分支將分支推送至遠端
- 遠端倉庫若是 Github，將觸發 github actions 做兩件事
  1. 將套件更新至 npm，但要在 repository 內先設定 secrets `NPM_TOKEN`，否則 pipeline 會失敗
  2. Github 倉庫內自動生成 releases note

>
