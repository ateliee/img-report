var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var assert = require('assert');
var file = require('../../lib/file');
var logger = require('../../lib/logger');
var winston = require('winston');
const fs = require('fs');

// ログレベルの変更
logger.clear()
    .add(new winston.transports.File({ filename: 'logs/console.log' }));

describe('Lib/file', function() {
    // describe('#indexOf()', function() {
    //     it('should return -1 when the value is not present', function() {
    //         assert.equal([1, 2, 3].indexOf(4), -1);
    //     });
    // });
    describe('_getDirImageList()', function() {
        it('files read check for examples/assets', function(done) {
            file._getDirImageList(__dirname+'/../../examples/assets').then((data) => {
                expect(data).to.be.an('array').that.does.be.length(12)
            }).then(done, done);
        });
    });
    describe('getImageList()', function() {
        it('files read check for examples/assets', function(done) {
            file.getImageList(__dirname+'/../../examples/assets').then((data) => {
                expect(data)
                    .to.be.an('object')
                    .to.have.property('example1')
                    .that.does.be.length(4)
            }).then(done, done);
        });
    });
    let tmp_dir = __dirname+'/../../tmp';
    let tmp_path = tmp_dir+'/sample.json';
    function setupWriteFile(){
        if (fs.existsSync(tmp_path)){
            fs.unlinkSync(tmp_path);
        }
        if (!fs.existsSync(tmp_dir)){
            fs.mkdirSync(tmp_dir);
        }
    }
    before(setupWriteFile);
    describe('_writeFile()', function() {
        it('make file', function(done) {
            let data = JSON.stringify({aaa: 'bbb'})
            file._writeFile(tmp_path, data).then(() => {
                expect(fs.existsSync(tmp_path))
                    .to.be.eq(true)
            }).then(done, done);
        });
        it('rm files', function(done) {
            file.rmdirSync(tmp_dir).then(() => {
                expect(fs.existsSync(tmp_dir))
                    .to.be.eq(false)
            }).then(done, done);
        });
        it('make file and dir2', function(done) {
            let data = JSON.stringify({aaa: 'bbb'})
            file._writeFile(tmp_path, data).then(() => {
                expect(fs.existsSync(tmp_path))
                    .to.be.eq(true)
            }).then(done, done);
        });
    });
    describe('genearteDiffImages()', function() {
        this.timeout(10000);
        it('generate diff report from examples/assets', function(done) {
            let src = __dirname+'/../../examples/assets';
            let dist = __dirname+'/../../tmp/dist';
            file.genearteDiffImages(src, dist, true).then((data) => {
                expect(fs.existsSync(dist+'/report.json'))
                    .to.be.eq(true)
            }).then(done, done);
        });
    });
});