#!/usr/bin/env zx

/**
* Usage 
*  Provide two ways to release your production
*   - npx zx ./scripts/release.mjs (It'll release your production by semver rules 
*   - npx zx ./scripts/release.mjs -r patch (Specify the release method yourself.)
*
*  # 版本格式：主版號.次版號.修訂號，版號遞增規則如下：
*  # major 主版號 -> 當你做了不相容的 API 修改 (breaking-change); 
*  # minor 次版號 -> 當你做了向下相容的功能性新增 (feature); 
*  # patch 修訂號 -> 當你做了向下相容的問題修正 (fix);
*  # semver 版本語意化 https://semver.org/lang/zh-TW/
**/

await $`set -e`;

const RELEASE_TYPE = ['major', 'minor', 'patch'];
const prefix = 'v'; // Define your version prefix here

/* 判斷有沒有 git */
if ( await $`[ -d .git ]`.exitCode != 0) {
  console.log(chalk.red(`ERROR: There is no git in your project, try "git init"`));
  await $`exit 1;`
};

/* 參數處理 */
let branch = 'master'; // 預設的發布分支是 master, 不建議修改
let release;
const args = process.argv.slice(3);

if (args.length % 2 != 0) {
  console.log(chalk.red(`ERROR: Parameters should be paired.`));
  await $`exit 1;`
};

while(args.length > 0) {
  switch (args[0]) {
    // 指定 release 方法
    case '-r':
    case '-release':
      release = args[1];
      args.shift();
      break;
    // 指定分支
    case '-b':
    case '-branch':
      branch = args[1];
      args.shift();
      break;
    default:
      await $`Unknown parameter passed ${args[1]}`;
      await $`exit 1`;
  }
  args.shift()
};

if (release) {
  // 判斷 release 變數是否為合法字串 -> major|minor|patch
  if (RELEASE_TYPE.includes(release)) {
    console.log('Release as ' + chalk.yellow(`${release}`));
  } else {
    console.log(chalk.red(`Release parameter should be 'major', 'minor' or 'patch'`));
    await $`exit 1;`
  }
} else {
  console.log(chalk.yellow(`Will release by semver rules`));
};

console.log('Branch is ' + chalk.yellow(`${branch}`));

await $`read -p "Press enter to continue .."`

/* 更新 */
await $`git checkout ${branch}`
await $`git pull origin ${branch}`
console.log(chalk.green(`Current pull origin ${branch}`));

/* 更新 CHANGELOG, 並生成對應 tag 分支 */
if (release) {
  await $`standard-version -r ${release} --tag-prefix ${prefix} --infile CHANGELOG.md`
} else {
  await $`standard-version --tag-prefix ${prefix} --infile CHANGELOG.md`
}

/* 更新 tag branch 到遠端 */
await $`git push --follow-tags origin ${branch}`

console.log(chalk.green('Release finished.'));