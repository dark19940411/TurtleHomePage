/**
 * Created by turtle on 2017/11/8.
 */
require('./utilities');

function Generator() {
    var DataReader = require('./../MarkdownFileProcess/datareader');
    var BlogPostPageViewModel = require('../ViewModel/BlogPostPageViewModel');
    var BlogListPageViewModel = require('../ViewModel/BlogsListPageViewModel');
    var ejs = require('ejs');
    var fs = require('fs-extra');
    var path = require('path');
    var renderbufferpool = require('./render_buffer_pool');
    var RenderBufferItem = require('../Model/RenderBufferItem');

    var self = this;
    var renderedMainPanel;

    function renderBlogPostPage(mdfilepath, metadata) {
        metadata.filepath = null;       //先把之前暂时存在对象内markdown文件的路径清除了

        var viewmodel = new BlogPostPageViewModel();
        metadata.content = renderBlogpostContent(metadata);
        viewmodel.formMainStructureRenderData(metadata, renderedMainPanel, function (err, msdata) {
            if (err) {
                return console.error(err);
            }
            var renderedMainStructure = renderMainStructure(msdata);
            //metadata现在等价于 RenderBufferItem. 后续会继续留存在内存里，所以必须把它的不再被使用的content（很占内存资源）清空
            metadata.content = null;
            writeBlogPostPageToDisk(mdfilepath, msdata, renderedMainStructure);
        });
    }

    function renderMainPanel(mpdata) {
        var mainPanelTempPath = __buildingTemplateDir.stringByAppendingPathComponent('main_panel.ejs');
        var options = {
            encoding: 'utf8'
        };
        var tempstr = fs.readFileSync(mainPanelTempPath, options);
        return ejs.render(tempstr, mpdata);
    }

    function renderBlogpostContent(regularizedData) {
        var viewmodel = new BlogPostPageViewModel();
        var articleContentRenderData = viewmodel.formPageContentRenderData(regularizedData);
        var bpcontentTempPath = __buildingTemplateDir.stringByAppendingPathComponent('blogpost_content.ejs');
        var options = {
            encoding: 'utf8'
        };
        var tempstr = fs.readFileSync(bpcontentTempPath, options);
        return ejs.render(tempstr, articleContentRenderData);
    }

    function renderMainStructure(msdata) {
        var mainStructureTempPath = __buildingTemplateDir.stringByAppendingPathComponent('main_structure.ejs');
        var options = {
            encoding: 'utf8'
        };
        var tempstr = fs.readFileSync(mainStructureTempPath, options);
        return ejs.render(tempstr, msdata);
    }

    function writeBlogPostPageToDisk(mdfilepath, msdata, pagecontent) {
        var blogPostPageFolderPath = __buildingBlogPostDir;
        var pageFolder = blogPostPageFolderPath.stringByAppendingPathComponent(msdata.title);
        var pagePath = pageFolder.stringByAppendingPathComponent(msdata.title + '.html');

        var articleImgsPath = path.dirname(mdfilepath).stringByAppendingPathComponent('images');
        var pageImgsPath = pageFolder.stringByAppendingPathComponent(articleImgsPath.lastPathcomponent());

        fs.ensureDir(pageFolder, function (err) {
            if (err) {
                return console.error(err);
            }

            var exist = fs.existsSync(articleImgsPath);
            if (exist) {
                fs.copy(articleImgsPath, pageImgsPath);
            }
            fs.writeFile(pagePath, pagecontent, function (err) {
                if (err) { return console.error(err); }
                if (msdata.title === articlesChain[articlesChain.length - 1].title) {       //这个判断有点糙，如果已渲染完最后一个，就清空缓冲池
                    renderbufferpool.clearArticleBufferPool();      //架构决定了文章内容页的数据需要被清理，而文章列表页会自动清理
                    console.log('Did empty article buffer pool'.green);
                    //TODO: 判断是否生成完所有页面，如果是，执行self.callback回调，否则没事发生
                }
            });
        });
    }

    function startRenderingBlogPostPageProcess(mdfilepath, renderBufferItem, idx) {
        renderbufferpool.articlePoolPush(renderBufferItem);

        var shouldRenderItem = renderbufferpool.shouldRenderArticleItem();
        if (shouldRenderItem) {
            // 渲染已有足够信息的文章页
            renderBlogPostPage(shouldRenderItem.filepath, shouldRenderItem);
        }

        if (idx === articlesChain.length - 1) {
            // 如果已经读取到了最后一篇文章，就应该把最后一篇文章也渲染了
            renderBlogPostPage(mdfilepath, renderBufferItem);
        }
    }

    function renderBlogsListContent(items, pageNum) {
        var blogsListTmplPath = __buildingTemplateDir.stringByAppendingPathComponent('blogs_list.ejs');
        var tmplStr = fs.readFileSync(blogsListTmplPath, { encoding: 'utf8' });
        return ejs.render(tmplStr, { renderItems: items });
    }

    function writeBlogsListPageToDisk(mscontent, msdata) {
        var pagePath;
        if (msdata.pageNum === 1) {
            pagePath = __builddir.stringByAppendingPathComponent('index.html');
        }
        else {
            pagePath = __builddir.stringByAppendingPathComponent('bloglistpages')
                .stringByAppendingPathComponent(String(msdata.pageNum))
                .stringByAppendingPathComponent('index.html');
        }

        var pagePathFolder = path.dirname(pagePath);
        fs.ensureDir(pagePathFolder, function (err) {
            if (err) {
                return console.error(err);
            }
            fs.writeFile(pagePath, mscontent, function (err) {
                if (err) {
                    return console.error(err);
                }
                //TODO: 判断是否生成完所有页面，如果是，执行self.callback回调，否则没事发生
            });
        });
    }

    function renderBlogsListPage(items, pageNum) {
        var viewmodel = new BlogListPageViewModel();
        viewmodel.addAddressToEveryItem(pageNum, items);
        var renderedBlogsListContent = renderBlogsListContent(items, pageNum);
        var metadata = {
            title: 'Turtle\'s Burrow',
            content: renderedBlogsListContent,
            pageNum: pageNum
        };

        viewmodel.formMainPanelRenderData(pageNum, function (err, mpdata) {
            var mpcontent = renderMainPanel(mpdata);
            viewmodel.formMainStructureRenderData(metadata, mpcontent, function (err, msdata) {
                if (err) {
                    return console.error(err);
                }

                var renderedMainStructure = renderMainStructure(msdata);
                writeBlogsListPageToDisk(renderedMainStructure, msdata);
            });
        });
    }

    function startRenderingBlogsListPageProcess(renderBufferItem) {
        renderbufferpool.bloglistPoolPush(renderBufferItem);
    }

    this.generate = function(callback) {
        self.callback = callback;

        var viewmodel = new BlogPostPageViewModel();
        viewmodel.formMainPanelRenderData(function (err, mpdata) {
            if (err) {
                console.error(err);
            }
            renderedMainPanel = renderMainPanel(mpdata);    //先生成只渲染一次的主面板

            renderbufferpool.evem.on(renderbufferpool.blogsListDataPreparedEventName, renderBlogsListPage);

            var datareader = new DataReader();
            datareader.readIn(function(mdfilepath, metadata, idx) {
                var renderBufferItem = new RenderBufferItem({
                    title: metadata.title,
                    date: metadata.date,
                    brev: metadata.brev
                });

                //临时把markdown转换出的html塞到renderBufferItem里，方便渲染。由于内存消耗大，所以渲染完成后就应该不再引用
                renderBufferItem.content = metadata.content;
                //把对应的markdown文件的path暂存到renderBufferItem里，方便后续移动对应的图片目录，不过这个字符串，后续可清可不清
                renderBufferItem.filepath = mdfilepath;

                startRenderingBlogPostPageProcess(mdfilepath, renderBufferItem, idx);
                startRenderingBlogsListPageProcess(renderBufferItem);
            });

        });
    }
}

module.exports = Generator;