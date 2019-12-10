const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./config');

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(process.cwd(), '.img-report')

module.exports = env => {
    var assets_path = null;
    if(env && env.assets !== undefined){
        assets_path = path.resolve(process.cwd(), env.assets);
    }else{
        assets_path = path.resolve(process.cwd(), 'assets');
    }
    if(!assets_path){
        throw new Error('paramaters asset not found or empty.', env.assets);
    }
    var diff_path = null;
    if(env && env.diff !== undefined){
        diff_path = path.resolve(process.cwd(), env.diff);
    }else{
        diff_path = path.resolve(process.cwd(), 'diff');
    }
    if(!diff_path){
        throw new Error('paramaters diff not found or empty.', env.diff);
    }
    let reports = require(path.resolve(diff_path, 'report.json'));

    console.log('asset path:', assets_path)
    console.log('diff path:', diff_path)
    return {
        mode: 'development',
        entry: src + '/index.jsx',
        output: {
            path: dist,
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        ...JSON.parse(fs.readFileSync(path.resolve(__dirname, './.babelrc'))),
                    }
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass']
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader  : 'url-loader?limit=30000&name=[path][name].[ext]'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                ASSETS_PATH: JSON.stringify(assets_path),
                DIFF_PATH: JSON.stringify(diff_path),
                REPORT_DATA: JSON.stringify(reports)
            }),
            new CopyPlugin([
                { from: assets_path, to: path.resolve(dist, config.sourceImageDir) },
                { from: diff_path, to: path.resolve(dist, config.diffImageDir) },
            ]),
            new HtmlWebpackPlugin({
                template: src + '/index.html',
                filename: 'index.html'
            }),
        ],
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 3000,
            writeToDisk: true
            // open: true
        },
    }
}