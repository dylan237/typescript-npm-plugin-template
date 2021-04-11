## standard version 常用指令說明

1. 產生 changelog 檔案

```bash
npx standard-version --first-release
```

2. 更新版號 (依據 semver 規則自動算出版本號)

```bash
npx standard-version
```

3. 在 command line 上先預覽更新內容

```bash
npx standard-version --dry-run
```

4. 更新到指定版本

```bash
npx standard-version --release-as major|minor|patch
npx standard-version --release-as 1.1.0
```

## 注意

💡 當版號還在 v0.x.z，major 還沒進到 v1 時，會被視為是 pre-production 的產品，因此 feature 和 fix 都只會更新 patch version；breaking change 則只會更新 minor version。
