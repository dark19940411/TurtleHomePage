/**
 * Created by turtle on 2017/11/10.
 */

var assert = require('assert');
require('../Turto/Tools/utilities');

var metadata = {
    content: "content",
    data: {
        title: "testtitle",
        date: "2016-12-07 11:50:59",
        tags: null
    }
};

describe('RegularizedArticleMetaData'.blue, function () {
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

describe('MarkdownFileTransformer'.blue, function () {
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

describe('BlogPostPageViewModel'.blue, function () {
    var BlogPostPageViewModel = require('../Turto/ViewModel/BlogPostPageViewModel');
    var regularizedData = {
        title: 'Test',
        content: 'This is a test',
        date: '2016-12-07 11:50:59',
        tags: null,
    };
    var viewmodel = new BlogPostPageViewModel();
    describe('#formMainStructureRenderData(regData, mainPanelContent, callBack)', function () {
        it('should form page render data to be put in main_structure.ejs template', function (done) {
            viewmodel.formMainStructureRenderData(regularizedData, '<div>this is a fake main panel</div>', function (err, data) {
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

describe('utilities.StringExtension'.blue, function () {
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

describe('ArticleChainBuilder'.blue, function () {
    var ACBuilder = require('../Turto/Tools/ArticlesChainBuilder');
    var builder = new ACBuilder();
    // describe('#build', function () {
    //     it('should build article chain orderly', function () {
    //         builder.build();
    //     });
    // });

    describe('#Array.prototype.__insert', function () {
        it('should insert item into articles chain orderly with a binary search.', function () {
            var chain = [];
            var item1 = {
                title: 'IBOutlet',
                date: 1481111459000
            };
            var item2 = {
                title: 'Share Ext',
                date: 1492421085000
            };
            var item3 = {
                title: '单例',
                date: 1477050518000
            };

            var item4 = {
                title: 'Lottie',
                date: 1491566866000
            };

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

            chain.__insert(item4);
            assertmsgprefix = 'fourth insert: ';
            assert(chain.length === 4, assertmsgprefix + 'chain.length === 4');
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item1.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item4.title, assertmsgprefix + 'chain[2].title cmp');
            assert(chain[3].title === item2.title, assertmsgprefix + 'chain[3].title cmp');

            chain = [];
            chain.__insert(item3);
            chain.__insert(item4);
            chain.__insert(item1);
            assertmsgprefix = 'specific test1 third insert: ';
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item1.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item4.title, assertmsgprefix + 'chain[2].title cmp');

            chain = [];
            chain.__insert(item3);
            chain.__insert(item4);
            chain.__insert(item2);
            assertmsgprefix = 'specific test2 third insert: ';
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item4.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item2.title, assertmsgprefix + 'chain[2].title cmp');

            chain = [];
            chain.__insert(item1);
            chain.__insert(item2);
            chain.__insert(item3);
            assertmsgprefix = 'specific test3 third insert: ';
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item1.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item2.title, assertmsgprefix + 'chain[2].title cmp');

            chain = [];
            chain.__insert(item1);
            chain.__insert(item2);
            chain.__insert(item4);
            assertmsgprefix = 'specific test4 third insert: ';
            assert(chain[0].title === item1.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item4.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item2.title, assertmsgprefix + 'chain[2].title cmp');

            chain = [];
            chain.__insert(item3);
            chain.__insert(item2);
            chain.__insert(item1);
            chain.__insert(item4);
            assertmsgprefix = 'specific test for fourth insert:';
            assert(chain[0].title === item3.title, assertmsgprefix + 'chain[0].title cmp');
            assert(chain[1].title === item1.title, assertmsgprefix + 'chain[1].title cmp');
            assert(chain[2].title === item4.title, assertmsgprefix + 'chain[2].title cmp');
            assert(chain[3].title === item2.title, assertmsgprefix + 'chain[3].title cmp');


            item1 = {
                title: '1',
                date: 1475071893000
            };

            item2 = {
                title: '2',
                date: 1477050518000
            };

            item3 = {
                title: '3',
                date: 1481111459000
            };

            item4 = {
                title: '4',
                date: 1488130799000
            };

            var item5 = {
                title: '5',
                date: 1491566866000
            };

            var item6 = {
                title: '6',
                date: 1492421085000
            };

            chain = [];
            chain.__insert(item3);
            chain.__insert(item5);
            chain.__insert(item2);
            chain.__insert(item4);
            chain.__insert(item6);

            assert(chain[4].title === item6.title);
        });
    });
});

describe('RenderBufferPool'.blue, function () {
    var pool = require('../Turto/Tools/render_buffer_pool');
    var RenderBufferItem = require('../Turto/Model/RenderBufferItem');
    var item1 = new RenderBufferItem({
        title: '1',
        date: 1475071893000,
        brev: 'testbrev'
    });

    var item2 = new RenderBufferItem({
        title: '2',
        date: 1477050518000,
        brev: 'testbrev'
    });

    var item3 = new RenderBufferItem({
        title: '3',
        date: 1481111459000,
        brev: 'testbrev'
    });

    var item4 = new RenderBufferItem({
        title: '4',
        date: 1488130799000,
        brev: 'testbrev'
    });
    describe('#articlePoolPush', function () {
        it('should push render buffer item into articles pool properly', function () {
            assert(pool.shouldRenderArticleItem() === null, 'empty pool, no renderable article item'.red);
            pool.articlePoolPush(item1);
            assert(pool.shouldRenderArticleItem() === null, pool.articleBufferPool.length + 'object in pool, no renderable article item'.red);
            pool.articlePoolPush(item2);
            assert(pool.articleBufferPool.length === 2, 'pool.articleBufferPool.length === 2');
            assert(pool.shouldRenderArticleItem() === item1, 'pool.shouldRenderArticleItem() === item1'.red);
            assert(pool.shouldRenderArticleItem().latterItem === item2, 'pool.shouldRenderArticleItem().latterItem === item2'.red);
            pool.articlePoolPush(item3);
            assert(pool.articleBufferPool.length === 3, 'third push: pool.articleBufferPool.length === 3'.red);
            assert(pool.shouldRenderArticleItem() === item2, 'pool.shouldRenderArticleItem() === item2'.red);
            assert(pool.shouldRenderArticleItem().formerItem === item1, 'pool.shouldRenderArticleItem().formerItem === item1'.red);
            assert(pool.shouldRenderArticleItem().latterItem === item3, 'pool.shouldRenderArticleItem().latterItem === item3'.red);
            pool.articlePoolPush(item4);
            assert(pool.articleBufferPool.length === 3, 'fourth push: pool.articleBufferPool.length === 3'.red);
            assert(pool.shouldRenderArticleItem() === item3, 'pool.shouldRenderArticleItem() === item3'.red);
            assert(pool.shouldRenderArticleItem().formerItem === item2, 'pool.shouldRenderArticleItem().formerItem === item2'.red);
            assert(pool.shouldRenderArticleItem().latterItem === item4, 'pool.shouldRenderArticleItem().latterItem === item4'.red);
            assert(pool.articleBufferPool[0].formerItem === null, 'pool.articleBufferPool[0].formerItem === null');

        });
    });

    describe('#clearArticleBufferPool', function () {
        it('should empty the article buffer pool', function () {
            pool.articlePoolPush(item1);
            pool.clearArticleBufferPool();
            assert(pool.articleBufferPool.length === 0);

            pool.articlePoolPush(item1);
            pool.articlePoolPush(item2);
            pool.clearArticleBufferPool();
            assert(pool.articleBufferPool.length === 0);

            pool.articlePoolPush(item1);
            pool.articlePoolPush(item2);
            pool.articlePoolPush(item3);
            pool.clearArticleBufferPool();
            assert(pool.articleBufferPool.length === 0);

            pool.articlePoolPush(item1);
            pool.articlePoolPush(item2);
            pool.articlePoolPush(item3);
            pool.articlePoolPush(item4);
            pool.clearArticleBufferPool();
            assert(pool.articleBufferPool.length === 0);
        });
    });
});