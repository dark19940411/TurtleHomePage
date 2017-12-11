/**
 * Created by turtle on 2017/11/8.
 */
require('./utilities');

function Generator() {
    var DataReader = require('./../MarkdownFileProcess/datareader');
    var BlogPostPageViewModel = require('../ViewModel/BlogPostPageViewModel');
    var ejs = require('ejs');
    var fs = require('fs-extra');
    var path = require('path');
    var renderbufferpool = require('./render_buffer_pool');
    var RenderBufferItem = require('../Model/RenderBufferItem');
    var renderedMainPanel;

    function renderBlogPostPage(mdfilepath, metadata) {
        metadata.filepath = null;       //先把之前暂时存在对象内markdown文件的路径清除了

        var viewmodel = new BlogPostPageViewModel();
        var renderedbpContent = renderBlogpostContent(metadata);
        metadata.content = renderedbpContent;
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
            fs.writeFile(pagePath, pagecontent);
        });
    }

    this.generate = function () {
        var viewmodel = new BlogPostPageViewModel();
        viewmodel.formMainPanelRenderData(function (err, mpdata) {
            if (err) {
                console.error(err);
            }
            renderedMainPanel = renderMainPanel(mpdata);    //先生成只渲染一次的主面板

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
            });

        });
    }
}

module.exports = Generator;