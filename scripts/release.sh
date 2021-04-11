#!/bin/bash

# Usage:
# 1. Set script into your pakage.json:
#   "scripts": {
#     "release": "sh ./scripts/release.sh"
#   }
# 2. Provide two ways to release your production
#   - npm run release (It'll release your production by semver rules automatically.)
#   - npm run release -r patch (Specify the release method yourself.)

# 版本格式：主版號.次版號.修訂號，版號遞增規則如下：
# major 主版號 -> 當你做了不相容的 API 修改 (breaking-change); 
# minor 次版號 -> 當你做了向下相容的功能性新增 (feature); 
# patch 修訂號 -> 當你做了向下相容的問題修正 (fix);
# semver 版本語意化 https://semver.org/lang/zh-TW/

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
prefix="v" # Define your version prefix here

# 判斷有沒有 git
if [ -d .git ]; then
  echo "OK" >/dev/null;
else
  echo "${RED}ERROR: There is no git in your project, try \"git init\".${NC}"
  exit 1;
fi

# 參數處理
while [[ "$#" > 0 ]]; do 
  case $1 in
    -r|--release) release="$2"; shift;; # 指定 release 方法
    -b|--branch) branch="$2"; shift;;   # 指定分支
    *) echo " ${RED}Unknown parameter passed: $1"${NC}; exit 1;;
  esac; 
  shift; 
done

if [ -z "$release" ]; then
  echo ${YELLOW}Will release by semver rules${NC};
else
  # 判斷 release 變數是否為合法字串 -> major|minor|patch
  case "$release" in
    major|minor|patch) 
      echo "OK" >/dev/null ;;
    *)
      echo "${RED}Release parameter should be 'major', 'minor' or 'patch'${NC}"
      exit 0;;
  esac
  echo Release as ${YELLOW}$release${NC};
fi

# 預設的發布分支是 master, 不建議修改
branch=${branch:='master'}
echo Branch is ${YELLOW}$branch${NC};

read -p "Press enter to continue .."

# 更新
git checkout $branch 
git pull origin $branch
echo "Current pull origin $branch."

# 更新 CHANGELOG, 並生成對應 tag 分支
if [ -z "$release" ]; then
  # 若沒有傳入 release 參數，standard-version 套件會透過 semver 規則自動升級對應版號
  standard-version --tag-prefix $prefix --infile CHANGELOG.md
else
  standard-version -r $release --tag-prefix $prefix --infile CHANGELOG.md
fi

# 更新 tag branch 到遠端
git push --follow-tags origin $branch

echo "${GREEN}Release finished.${NC}";


