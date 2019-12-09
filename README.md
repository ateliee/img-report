# Image Report

Extract image differences between directories and output HTML reports

## usage
* Node 10.13.*
* [webpack 4.41.2](https://webpack.js.org/)
* [React 16.12.0](https://ja.reactjs.org/)
* [resemblejs](https://github.com/rsmbl/Resemble.js)
* [Material-UI](https://material-ui.com/)

## install
```
npm install ateliee/img-report --save-dev
```

insert package.json
```
  "scripts": {
    "img-report": "img-report"
  },
```
## howto

### diff画像作成
```
npm run img-report
npm run img-report -- -s ./examples/assets/ -d ./examples/dist
```

### レポート出力

デフォルトでは差分ディレクトリはcwdのassets、diffをdistに設定されます。
```
npm run img-report build 
# パラメータを変更したい場合
npm run img-report build -- --env.assets=tmp/assets --env.diff=tmp/diff
```

.img-reportが現在のディレクトリに作成されます。

### サーバー起動
```
npm run img-report serve
# ブラウザ自動起動
npm run img-report serve -- --open
```