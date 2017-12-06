function BlogPostPageViewModel() {
    var path = require('path');
    var fs = require('fs');
    var MPData = require('../Model/MainPanelData');
    var MSData = require('../Model/MainStructureData');
    require('../Tools/utilities');

    // 生成页面右侧内容(文章以及标题以及导航按钮等)的渲染数据
    this.formPageContentRenderData = function (regularizedArticleMetaData) {
        var data = {
            articleContent: regularizedArticleMetaData.content
        };
        return data;
    };

    // 生成渲染完整的博客发布页面所需要的数据
    this.formMainStructureRenderData = function (regularizedArticleMetaData, mainPanelContent, callBack) {
        var filerefpath = __buildingTemplateDir.stringByAppendingPathComponent('blogpost_fileref');
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
    };

    // 生成渲染主面板所需要的数据
    this.formMainPanelRenderData = function (callback) {
        var configFilePath = path.resolve(__dirname, '../config.json');
        fs.readFile(configFilePath, function (error, data) {
            if (error) {
                callback(error);
                return console.error(error);
            }
            var jsonobj = JSON.parse(data.toString());
            jsonobj.icon = '../../assets/images/' + jsonobj.icon;
            var mpdata = new MPData(jsonobj);
            callback(null, mpdata);
        });
    };


}

module.exports = BlogPostPageViewModel;