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

    function renderBlogPostPage(mdfilepath, metadata) {
        var viewmodel = new BlogPostPageViewModel();
        viewmodel.formMainPanelRenderData(function (err, mpdata) {
            if (err) {
                return console.error(err);
            }

            var renderedMainPanel = renderMainPanel(mpdata);
            viewmodel.formPageRenderData(metadata, renderedMainPanel, function (err, msdata) {
                if (err) {
                    return console.error(err);
                }
                var renderedMainStructure = renderMainStructure(msdata);
                writeBlogPostPageToDisk(mdfilepath, msdata, renderedMainStructure);
            });
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
        var datareader = new DataReader();
        datareader.readIn(function(mdfilepath, metadata) {
            renderBlogPostPage(mdfilepath, metadata);
        });
    }
}

module.exports = Generator;