require('../Tools/utilities');
function BlogsListPageViewModel() {
    var fs = require('fs');
    var MSData = require('../Model/MainStructureData');
    var MPData = require('../Model/MainPanelData');
    var path = require('path');
    this.formMainPanelRenderData = function (pageNum, callback) {
        var configFilePath = path.resolve(__dirname, '../config.json');
        fs.readFile(configFilePath, function (error, data) {
            if (error) {
                callback(error);
                return console.error(error);
            }
            var jsonobj = JSON.parse(data.toString());
            if (pageNum === 1) {
                jsonobj.icon = 'assets/images/' + jsonobj.icon;
                jsonobj.frontPageAddress = '';
            }
            else {
                jsonobj.icon = '../../assets/images/' + jsonobj.icon;
                jsonobj.frontPageAddress = '../../';
            }

            var mpdata = new MPData(jsonobj);
            callback(null, mpdata);
        });
    };

    // 生成渲染完整的博客列表页面所需要的数据
    this.formMainStructureRenderData = function (metadata, mainPanelContent, callBack) {
        var filerefpath = __buildingTemplateDir.stringByAppendingPathComponent('blogs_list_fileref');
        fs.readFile(filerefpath, function (err, data) {
            if (err) {
                callBack(err);
                return console.error(err);
            }

            var fileref = data.toString();
            if (metadata.pageNum === 1) {
                fileref = fileref.replaceAll('\\.\\./\\.\\./', '');
                var frontPageAddress = ''
            }
            else {
                frontPageAddress = '../../';
            }

            var msdata = new MSData({
                fileref: fileref,
                title: metadata.title,
                mainPanel: mainPanelContent,
                generatedContent: metadata.content,
                frontPageAddress: frontPageAddress
            });
            msdata.pageNum = metadata.pageNum;
            callBack(null, msdata);
        });
    };

    this.addAddressToEveryItem = function (pageNum, items) {
        if (pageNum === 1) {
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                item.address = 'blogpost'.stringByAppendingPathComponent(item.title)
                    .stringByAppendingPathComponent(item.title + '.html');
            }
        }
        else {
            for (i = 0; i < items.length; ++i) {
                item = items[i];
                item.address = '../..'.stringByAppendingPathComponent('blogpost')
                    .stringByAppendingPathComponent(item.title)
                    .stringByAppendingPathComponent(item.title + '.html');
            }
        }
    };
}

module.exports = BlogsListPageViewModel;