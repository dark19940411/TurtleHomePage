function BlogPostPageViewModel() {
    var path = require('path');
    var fs = require('fs');
    var MPData = require('../Model/MainPanelData');
    var MSData = require('../Model/MainStructureData');

    this.formPageRenderData = function (regularizedArticleMetaData, mainPanelContent, callBack) {
        var filerefpath = path.resolve(__dirname, '../../build/Template/blogpost_fileref');
        fs.readFile(filerefpath, function (err, data) {
           if (err) {
               callBack(err);
               return console.error(err);
           }
           var msdata = new MSData({
               fileref: data.toString(),
               title: regularizedArticleMetaData.title,
               mainPanel: mainPanelContent,
               generatedContent: regularizedArticleMetaData.content,
           });

           callBack(null, msdata);
        });
    }

    this.formMainPanelRenderData = function (callback) {
        var configFilePath = path.resolve(__dirname, '../config.json');
        fs.readFile(configFilePath, function (error, data) {
            if (error) {
                callback(error);
                return console.error(error);
            }
            var jsonobj = JSON.parse(data.toString());
            var mpdata = new MPData(jsonobj);
            callback(null, mpdata);
        });
    }
}

module.exports = BlogPostPageViewModel;