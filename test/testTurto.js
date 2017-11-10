/**
 * Created by turtle on 2017/11/10.
 */

var assert = require('assert');

var metadata = {
    content: "content",
    data: {
        title: "testtitle",
        date: "2016-12-07 11:50:59",
        tags: null,
    },
};

describe('RegularizedArticleMetaData', function () {
    var RegularizedArticleMetaData = require('../Turto/MarkdownFileProcess/RegularizedArticleMetaData');

    describe('#constructor', function () {
        it('should construct a RegularizedArticleMetaData with data processed by gray-matter', function () {
            var data = new RegularizedArticleMetaData(metadata);
            assert(data.constructor = RegularizedArticleMetaData);
            assert(data.title === "testtitle");
            assert(data.date === "2016-12-07 11:50:59");
            assert(data.tags === null);
        });
    });
});

describe('MarkdownFileTransformer', function () {
    var marked = require("marked");
    var MarkdownFileTransformer = require('../Turto/MarkdownFileProcess/MarkdownFileTransformer');
    var RegularizedArticleMetaData = require('../Turto/MarkdownFileProcess/RegularizedArticleMetaData');
    describe('#startTransform(metadata, callback)', function () {
        it('should transform metadata\'s markdown content to html', function (done) {
            var transformer = new MarkdownFileTransformer();
            var rawdata = new RegularizedArticleMetaData(metadata);

            var content = rawdata.content;
            transformer.startTransform(rawdata, function (data) {
                assert(data.content === marked(content));
                done();
            });
        });
    });
});