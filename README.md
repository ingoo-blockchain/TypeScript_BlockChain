# Typescript 세팅

```sh
npm init
npm install typescript
```

typescript 명령어 실행하기

```sh
./node_modules/.bin/tsc --init

# 만약 경로가 귀찮으면, package.json 에서 설정
"scripts": {
    "tsc:init":"tsc --init",
}

npm run tsc:init
```

그럼 `tsconfig.json` 파일이 생성
사실 안하고 직접 생성해도 됨.

설정파일을 조금 설정하고.
compile을 진행해봄

# jest ts 설정

```sh
npm install --save-dev babel-jest @babel/core @babel/prest-env
```

git flow start feature blockchain
git flow finish feature blockchain
