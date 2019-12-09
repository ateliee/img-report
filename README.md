# 画像比較レポート

## usage
* Node 10.13.*
* [webpack 4.41.2](https://webpack.js.org/)
* [React 16.12.0](https://ja.reactjs.org/)
* [resemblejs](https://github.com/rsmbl/Resemble.js)
* [Material-UI](https://material-ui.com/)

## install
```
npm install
```

## howto

### diff画像作成
```
node bin/img-report.js -s ./examples/assets/ -d ./examples/dist
npm start -- -s ./examples/assets/ -d ./examples/dist
```

### レポート出力

デフォルトでは差分ディレクトリはcwdのassets、diffをdistに設定されます。
```
npm run build 
# パラメータを変更したい場合
npm run build -- --env.assets=tmp/assets --env.diff=tmp/diff
```

.img-reportが現在のディレクトリに作成されます。

### サーバー起動
```
npm run serve
# ブラウザ自動起動
npm run serve -- --open
```