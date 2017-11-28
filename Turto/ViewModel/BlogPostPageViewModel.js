function BlogPostPageViewModel() {
    var path = require('path');
    var fs = require('fs');

    this.formPageRenderData = function (regularizedArticleMetaData, mainPanelContent, callBack) {
        var filerefpath = path.resolve(__dirname, '../../build/Template/blogpost_fileref');
        fs.readFile(filerefpath, function (err, data) {
           if (err) {
               callBack(err);
               return console.error(err);
           }
           var obj = {
               fileref: data.toString(),
               title: regularizedArticleMetaData.title,
               mainPanel: mainPanelContent,
               generatedContent: regularizedArticleMetaData.content,
           };

           callBack(null, obj);
        });
    }

    this.formMainPanelRenderData = function (callback) {
        var configFilePath = path.resolve(__dirname, '../config.json');
        fs.readFile(configFilePath, function (error, data) {
            if (error) {
                callBack(error);
                return console.error(error);
            }
            var jsonobj = JSON.parse(data.toString());
            callBack(null, jsonobj);
        });
    }
}

module.exports = BlogPostPageViewModel;