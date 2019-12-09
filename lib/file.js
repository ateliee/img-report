// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const compareImages = require('resemblejs/compareImages');
require('date-utils');

module.exports = {
    _wariteFile: async function (file, data, callback){
        var folder = path.dirname(file);
        await fs.mkdir(folder, { recursive: true }, (err) => {
            if (err) throw err;
            fs.writeFile(file, data, callback);
        });
    },
    rmdirSync: async function(path){
        return new Promise(resolve => {
            fs.remove(path, err => {
                if (err) throw err;
                console.log('delete dir: '+path)
                resolve(path)
            })
        })
    },
    /**
     *
     * @param {string} src
     * @param {string} output
     * @param {boolean} force
     * @returns {Promise<void>}
     */
    genearteDiffImages: async function (src, output, force){
        if(force){
            await this.rmdirSync(output);
        }
        let files = await this.getImageList(src);
        console.log(files)
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
                let name = c[kk]
                if(base.indexOf(name) < 0){
                    continue;
                }
                let img1 = path.join(src, base_key, name)
                let img2 = path.join(src, k, name)
                let res = path.join(output, k, name)
                let diff = await this.saveDiffImage(img1, img2, res)
                diff_images[name] = {
                    image: path.join(k, name),
                    data: diff.data
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
        console.log('save report: '+report_path)
    },
    /**
     *
     * @param {string} img1
     * @param {string} img2
     * @param {string} output
     * @returns {Promise<void>}
     */
    saveDiffImage: async function (img1, img2, output) {
        const options = {
            output: {
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
            },
            scaleToSameSize: true,
            ignore: "antialiasing"
        };

        // The parameters can be Node Buffers
        // data is the same as usual with an additional getBuffer() function
        const data = await compareImages(
            fs.readFileSync(img1),
            fs.readFileSync(img2),
            options
        );

        return new Promise((resolve, reject) => {
            this._wariteFile(output, data.getBuffer(), (err, d) => {
                if (err) throw err;

                let res = {
                    image_path: output,
                    data: {
                        isSameDimensions: data.isSameDimensions,
                        dimensionDifference: data.dimensionDifference,
                        rawMisMatchPercentage: data.rawMisMatchPercentage,
                        misMatchPercentage: data.misMatchPercentage,
                        diffBounds: data.diffBounds,
                        analysisTime: data.analysisTime
                    }
                };
                console.log('The file has been saved: ' + output);
                resolve(res)
            });
        })
    },
    /**
     * @param {string} dir
     * @param {string} absolete
     * @returns {Promise<string[]>}
     * @private
     */
    _getDirImageList: async function (dir, absolete) {
        let dirname = absolete ? path.join(dir, absolete) : dir
        let datas = [];
        return new Promise((resolve, reject) => {
            fs.readdir(dirname, {withFileTypes: true}, async (err, dirents) => {
                if (err){
                    reject(err)
                }
                for (const dirent of dirents) {
                    const fp = path.join(dirname, dirent.name);
                    if (dirent.isDirectory()) {
                        let files = await this._getDirImageList(dir, absolete ? path.join(absolete, dirent.name) : dirent.name)
                        datas = datas.concat(files)
                    } else if(path.extname(dirent.name)){
                        datas.push(absolete ? path.join(absolete, dirent.name) : dirent.name)
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
            fs.readdir(dirname, {withFileTypes: true}, async (err, dirents) => {
                if (err){
                    reject(err)
                }
                let datas = {};
                for (const dirent of dirents) {
                    const fp = path.join(dirname, dirent.name);
                    if (!dirent.isDirectory()) {
                        if(path.extname(dirent.name)){
                            console.log('Not directory: ' + fp)
                        }
                        continue;
                    }
                    let files = await this._getDirImageList(path.join(dirname, dirent.name))
                    datas[dirent.name] = files;
                }
                resolve(datas);
            })
        })
    }
};