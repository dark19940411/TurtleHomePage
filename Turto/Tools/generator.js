/**
 * Created by turtle on 2017/11/8.
 */
require('./utilities');

function Generator() {
    var DataReader = require('./../MarkdownFileProcess/datareader');
    var BlogPostPageViewModel = require('../ViewModel/BlogPostPageViewModel');
    var ejs = require('ejs');
    var fs = require('fs');
    var path = require('path');

    this.generate = function () {
        var datareader = new DataReader();
        datareader.readIn(function(metadata) {
            renderBlogPostPage(metadata);
        });

        function renderBlogPostPage(metadata) {
            var viewmodel = new BlogPostPageViewModel();
            viewmodel.formMainPanelRenderData(function (err, mpdata) {
                if (err) {
                    return console.error(err);
                }

                var renderedMainPanel = renderedMainPanel(mpdata);
                viewmodel.formPageRenderData(metadata, renderedMainPanel, function (err, msdata) {
                    if (err) {
                        return console.error(err);
                    }
                    var renderedMainStructure = renderMainStructure(msdata);
                    writeBlogPostPageToDisk(msdata, renderedMainStructure);
                });
            });
        }

        function renderMainPanel(mpdata) {
            var mainPanelTempPath = path.resolve(__dirname, '../../build/Template/main_panel.ejs');
            var options = {
                encoding: 'utf8'
            };
            var tempstr = fs.readFileSync(mainPanelTempPath, options);
            return ejs.render(tempstr, mpdata);
        }

        function renderMainStructure(msdata) {
            var mainStructureTempPath = path.resolve(__dirname, '../../build/Template/main_structure.ejs');
            var options = {
                encoding: 'utf8'
            };
            var tempstr = fs.readFileSync(mainStructureTempPath, options);
            return ejs.render(tempstr, msdata);
        }

        function writeBlogPostPageToDisk(msdata, pagecontent) {
            var blogPostPageFolderPath = path.resolve(__dirname, '../../build/blogpost');
            var pagePath = blogPostPageFolderPath + '/' + msdata.title + '.html';
            var exists = fs.existsSync(blogPostPageFolderPath);
            if(exists) {
                fs.writeFileSync(pagePath, renderedHtml);
            } else {
                fs.mkdir(blogPostPageFolderPath, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    fs.writeFileSync(pagePath, renderedHtml);
                });
            }
        }
    }
}

module.exports = Generator;