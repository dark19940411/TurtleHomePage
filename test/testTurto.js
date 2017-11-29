/**
 * Created by turtle on 2017/11/10.
 */

var assert = require('assert');

var metadata = {
    content: "content",
    data: {
        title: "testtitle",
        date: "2016-12-07 11:50:59",
        tags: null
    }
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
        it('should transform metadata\'s markdown content to html', function () {
            var transformer = new MarkdownFileTransformer();
            var rawdata = new RegularizedArticleMetaData(metadata);

            var content = rawdata.content;
            var data = transformer.transform(rawdata)
            assert(data.content === marked(content));
        });
    });
});

describe('BlogPostPageViewModel', function () {
    var BlogPostPageViewModel = require('../Turto/ViewModel/BlogPostPageViewModel');
    var regularizedData = {
        title: 'Test',
        content: 'This is a test',
        date: '2016-12-07 11:50:59',
        tags: null,
    };
    var viewmodel = new BlogPostPageViewModel();
    describe('#formPageRenderData(regData, mainPanelContent, callBack)', function () {
        it('should form page render data to be put in main_structure.ejs template', function (done) {
            viewmodel.formPageRenderData(regularizedData, '<div>this is a fake main panel</div>', function (err, data) {
                if (err) {
                    done(err);
                }
                assert(data.title === 'Test');
                assert(data.generatedContent === 'This is a test');
                assert(typeof(data.fileref) !== 'undefined');
                assert(data.mainPanel === '<div>this is a fake main panel</div>');
                done();
            });
        });
    });

    describe('#formMainPanelRenderData(callback)', function () {
        it('should form MainPanel\'s render data by config.json properly', function (done) {
            viewmodel.formMainPanelRenderData(function (err, data) {
                if (err) {
                    done(err);
                }

                assert(data.icon.lastPathcomponent() === 'Icon.jpeg');
                assert(data.username === 'Turtle');
                assert(data.slogan === '虽然慢，但是我有在爬呀');
                assert(data.github === 'https://github.com/dark19940411');
                assert(data.weibo === 'https://weibo.com/1950154683');
                done();
            });
        });
    });
});

require('../Turto/Tools/utilities');

describe('utilities.StringExtension', function () {
    describe('#lastPathComponent', function () {
        it('should return a path string\' s last path component.', function () {
            var path = 'test.txt';
            var comp = path.lastPathcomponent();
            assert(comp === 'test.txt');

            path = 'a/test.txt';
            comp = path.lastPathcomponent();
            assert(comp === 'test.txt');

            path = 'a/b/test.txt';
            comp = path.lastPathcomponent();
            assert(comp === 'test.txt');

            path = 'a';
            comp = path.lastPathcomponent();
            assert(comp === 'a');

            path = 'a/b';
            comp = path.lastPathcomponent();
            assert(comp === 'b');

            path = 'a/b/c';
            comp = path.lastPathcomponent();
            assert(comp === 'c');

            path = 'a/';
            comp = path.lastPathcomponent();
            assert(comp === 'a/');
        });
    });

    describe('#stringByAppendingPathComponent', function () {
        it('should append a file name string to a path string making a new path.', function () {
            var str = 'test'.stringByAppendingPathComponent('name');
            assert(str === 'test/name', 'str === \'test/name\'');
            str = 'test/astes/123124/test'.stringByAppendingPathComponent('file.format');
            assert(str === 'test/astes/123124/test/file.format', 'str === \'test/astes/123124/test/file.format\'');
            str = ''.stringByAppendingPathComponent('file');
            assert(str === '/file', '\'\' add \'file\' as path component must equal to \'/file\'');
            str = 'folder'.stringByAppendingPathComponent('');
            assert(str === 'folder/', str + '=== folder/');
        });
    });
});