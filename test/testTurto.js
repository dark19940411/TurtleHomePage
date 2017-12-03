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

    describe('#global variables', function () {
        var fs = require('fs');
        it('should contain correct paths to specific places', function () {
            console.log('builddir: ' + __builddir + '\n'
                + 'buildingBlogPostDir: ' + __buildingBlogPostDir + '\n'
                + 'buildingTemplateDir: ' + __buildingTemplateDir + '\n'
                + 'distdir: ' + __distdir + '\n'
                + 'postdir: ' + __postdir + '\n');
            assert(fs.existsSync(__builddir), '__builddir exists.');
            assert(fs.existsSync(__buildingBlogPostDir), '__buildingBlogPostDir exists.');
            assert(fs.existsSync(__buildingTemplateDir), '__buildingTemplateDir exists.');
            assert(fs.existsSync(__distdir), '__distdir exists.');
            assert(fs.existsSync(__postdir), '__postdir exists.');
        });
    });
});

describe('ArticleChainBuilder', function () {
    var ACBuilder = require('../Turto/Tools/ArticlesChainBuilder');
    var builder = new ACBuilder();
    describe('#build', function () {
        it('should build article chain orderly', function () {
            builder.build();
        });
    });

    describe('#Array.prototype.__insert', function () {
        it('should insert item into articles chain orderly with a binary search.', function () {
            var chain = [];
            var item1 = {
                title: 'IBOutlet',
                date: Date.parse('2016-12-07 11:50:59')
            };
            var item2 = {
                title: 'Share Ext',
                date: Date.parse('2017-04-07 12:07:46')
            };
            var item3 = {
                title: '单例',
                date: Date.parse('2016-10-21 11:48:38')
            }

            chain.__insert(item1);

            assert(chain.length === 1, 'first insert: chain.length === 1');
            assert(chain[0].title === item1.title, 'first insert: chain[0] title cmp');

            chain.__insert(item2);
            assert(chain.length === 2, 'second insert: chain.length === 2');
            assert(chain[0].title === item1.title, 'second insert: chain[0].title cmp');
            assert(chain[1].title === item2.title, 'second insert: chain[1].title cmp');

            chain.__insert(item3);
            var assertmsgprefix = 'third insert:';
            assert(chain.length === 3, 'third insert: chain.length === 3');
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item1.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item2.title, assertmsgprefix + 'chain[2] title cmp');
        });
    });
});