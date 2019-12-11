# Image Report

[![Build Status](https://travis-ci.com/ateliee/img-report.svg?branch=master)](https://travis-ci.com/ateliee/img-report)

[![Coverage Status](https://coveralls.io/repos/github/ateliee/img-report/badge.svg?branch=master)](https://coveralls.io/github/ateliee/img-report?branch=master)

Extract image differences between directories and output HTML reports

![](examples/img/screen.png)

[See Demo Page](https://ateliee.github.io/img-report/)

## Usage

* Node <= 8.16.2
* [webpack 4.41.2](https://webpack.js.org/)
* [React 16.12.0](https://ja.reactjs.org/)
* [Resemble.js](https://github.com/rsmbl/Resemble.js)
* [Material-UI](https://material-ui.com/)

### for Development

* [ESlint](https://eslint.org/)
* [Mocha](https://mochajs.org/)
* [Chai.js](https://www.chaijs.com/)

## Install
```
npm install ateliee/img-report --save-dev
```

## Howto

### diff画像作成
```
img-report diff ./assets ./dist
# 出力フォルダをクリア
img-report diff ./assets ./dist -f
# reportも合わせて出力
img-report diff ./assets ./dist -r
```

### レポート出力

```
img-report build -s ./assets/ -d ./dist/
```

.img-reportが現在のディレクトリに作成されます。

### サーバー起動
```
img-report serve -s ./assets/ -d ./dist/
```

## For Development

### lint
```
npm run-script lint
npm run-script lint:fix
```

### unit test
```
npm test
```

## Exmaple Images

* [Illust AC](https://www.ac-illust.com/)