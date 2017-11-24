function BlogPostPageViewModel() {
    var path = require('path');
    var fs = require('fs');
    var configFilePath = path.resolve(__dirname, '../config.json');

    this.formPageRenderData = function (regularizedArticleMetaData, callBack) {
        fs.readFile(configFilePath, function (error, data) {
            if (error) {
                callBack(error);
                return console.error(error);
            }
            var jsonobj = JSON.parse(data.toString());
            jsonobj.title = regularizedArticleMetaData.title;
            jsonobj.generatedContent = regularizedArticleMetaData.content;
            callBack(null, jsonobj);
        });
    }
}

module.exports = BlogPostPageViewModel;