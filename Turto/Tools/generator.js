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
            var viewmodel = new BlogPostPageViewModel();
            viewmodel.formPageRenderData(metadata, function (err, formeddata) {
                if (err) {
                    return console.error(err);
                }
                var mainPanelTempPath = path.resolve(__dirname, '../../build/Template/main_panel.ejs');
                var options = {
                    encoding: 'utf8'
                };
                var tempstr = fs.readFileSync(mainPanelTempPath, options);
                var renderedHtml = ejs.render(tempstr, formeddata);

                var blogPostPageFolderPath = path.resolve(__dirname, '../../dist/blogpost');
                var pagePath = blogPostPageFolderPath + '/' + formeddata.title + '.html';
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
            });
        });
    }
}

module.exports = Generator;