// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const resemble = require('resemblejs');
const imageSize = require('image-size');
const logger = require('./logger');
require('date-utils');

module.exports = {
    /**
     * ファイルに保存
     * @param {string} file
     * @param {any} data
     * @returns {Promise<void>}
     * @private
     */
    _writeFile: async function (file, data){
        var folder = path.dirname(file);
        return new Promise((resolve) => {
            if (!fs.existsSync(folder)){
                fs.mkdir(folder, { recursive: true }, (err) => {
                    if (err) throw err;
                    fs.writeFile(file, data, () => {
                        resolve()
                    });
                });
            }else{
                fs.writeFile(file, data, () => {
                    resolve()
                });
            }
        });
    },
    /**
     * ディレクトリを削除
     * @param {string} path
     * @returns {Promise<string>}
     */
    rmdirSync: async function(path){
        return new Promise(resolve => {
            fs.remove(path, err => {
                if (err) throw err;
                logger.info('delete dir: '+path)
                resolve(path)
            })
        })
    },
    /**
     * ディレクトリをチェックし、diff画像を生成
     * @param {string} src
     * @param {string} output
     * @param {boolean} force
     * @param {object|undefined} config
     * @returns {Promise<void>}
     */
    genearteDiffImages: async function (src, output, force, config){
        if(force){
            await this.rmdirSync(output);
        }
        if (!fs.existsSync(output)){
            fs.mkdirSync(output);
        }
        let files = await this.getImageList(src);
        logger.info(files)
        if(files.length <= 0){
            return
        }
        let base_key = Object.keys(files)[0];
        var base = files[base_key];
        let diffs = {};
        for(let k in files){
            if(base_key === k){
                continue;
            }
            let c = files[k];
            let diff_images = {};
            for(let kk in c) {
                let name = c[kk].name
                if(base[name] === undefined){
                    continue;
                }
                let img1 = path.join(src, base_key, name)
                let img2 = path.join(src, k, name)
                let res = path.join(output, k, name)
                let diff = await this.saveDiffImage(img1, img2, res, config)
                let size = await imageSize(res);
                diff_images[name] = {
                    image: path.join(k, name),
                    data: diff.data,
                    info: size
                };
            }
            diffs[k] = diff_images;
        }
        let data = {
            files: files,
            base: base_key,
            diff: diffs,
            created: (new Date()).toFormat('YYYY-MM-DD HH:MM:SS')
        };
        let report_path = path.join(output, 'report.json');
        await fs.writeFile(report_path, JSON.stringify(data, null, 0));
        logger.info('save report: '+report_path)
    },
    /**
     * diff画像を生成し保存
     * @param {string} img1
     * @param {string} img2
     * @param {string} output
     * @param {object|undefined} config
     * @returns {Promise<void>}
     */
    saveDiffImage: async function (img1, img2, output, config) {
        if(!config){
            config = {
                errorColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 255
                },
                errorType: "movement",
                transparency: 0.2,
                largeImageThreshold: 1200,
                useCrossOrigin: false,
                outputDiff: true
            };
        }
        resemble.outputSettings(config);

        let self = this;
        return new Promise((resolve, reject) => {
            resemble(fs.readFileSync(img1))
                .compareTo(fs.readFileSync(img2))
                .scaleToSameSize()
                .ignoreAntialiasing()
                .onComplete(async function(data) {
                    if(!data || !data.getBuffer()){
                        reject(new Error('error compare image.'))
                        return null;
                    }
                    logger.info('antialiasing data:', data)
                    await self._writeFile(output, data.getBuffer())
                        .then(() => {
                            let res = {
                                image_path: output,
                                data: {
                                    isSameDimensions: data.isSameDimensions,
                                    dimensionDifference: data.dimensionDifference,
                                    rawMisMatchPercentage: data.rawMisMatchPercentage,
                                    misMatchPercentage: data.misMatchPercentage,
                                    diffBounds: data.diffBounds,
                                    analysisTime: data.analysisTime
                                },
                            };
                            logger.info('The file has been saved: ' + output);
                            resolve(res)
                        }).catch(e => {
                            throw e;
                        });
                });
        })
    },
    /**
     * ディレクトリ一覧を取得
     *
     * @param {string} dir
     * @param {string} absolete
     * @returns {Promise<string[]>}
     * @private
     */
    _getDirImageList: async function (dir, absolete) {
        let dirname = absolete ? path.resolve(dir, absolete) : dir
        let datas = {};
        return new Promise((resolve, reject) => {
            fs.readdir(dirname, async (err, dirents) => {
                if (err){
                    reject(err)
                }
                for (const name of dirents) {
                    const fp = path.join(dirname, name);
                    let dirent = fs.statSync(fp)
                    if (dirent.isDirectory()) {
                        let files = await this._getDirImageList(dir, absolete ? path.join(absolete, name) : name)
                        datas = Object.assign(datas, files)
                    } else if(path.extname(fp)){
                        let size = await imageSize(fp);
                        let n = absolete ? path.join(absolete, name) : name;
                        datas[n] = {
                            name: n,
                            info: size
                        }
                    }
                }
                resolve(datas)
            })
        })
    },
    /**
     * 画像一覧を取得
     * @param {string} dirname
     * @returns {Promise<Object>}
     */
    getImageList: async function (dirname) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirname, async (err, dirents) => {
                if (err){
                    reject(err)
                }
                let datas = {};
                for (const name of dirents) {
                    const fp = path.join(dirname, name);
                    let dirent = fs.statSync(fp)
                    if (!dirent.isDirectory()) {
                        if(path.extname(name)){
                            logger.info('Not directory: ' + fp)
                        }
                        continue;
                    }
                    let files = await this._getDirImageList(fp)
                    datas[name] = files;
                }
                resolve(datas);
            })
        })
    }
};