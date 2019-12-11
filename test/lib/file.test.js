var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var assert = require('assert');
var file = require('../../lib/file');

describe('Lib/file', function() {
    // describe('#indexOf()', function() {
    //     it('should return -1 when the value is not present', function() {
    //         assert.equal([1, 2, 3].indexOf(4), -1);
    //     });
    // });
    describe('_getDirImageList()', function() {
        it('files read check for examples/assets', function(done) {
            file._getDirImageList(__dirname+'/../../examples/assets').then((data) => {
                expect(data).to.be.an('array').that.does.be.length(8)
            }).then(done, done);
        });
    });
});