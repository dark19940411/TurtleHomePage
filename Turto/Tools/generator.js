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
                var mainPanelTempPath = path.resolve(__dirname, '../../Template/main_panel.ejs');
                var options = {
                    encoding: 'utf8'
                };
                var tempstr = fs.readFileSync(mainPanelTempPath, options);
                var renderedHtml = ejs.render(tempstr, formeddata);
                
            });
        });
    }
}

module.exports = Generator;