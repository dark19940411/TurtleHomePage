function BlogsListPageViewModel() {
    var fs = require('fs');
    var MSData = require('../Model/MainStructureData');
    // 生成渲染完整的博客列表页面所需要的数据
    this.formMainStructureRenderData = function (metadata, mainPanelContent, callBack) {
        var filerefpath = __buildingTemplateDir.stringByAppendingPathComponent('blogs_list_fileref');
        fs.readFile(filerefpath, function (err, data) {
            if (err) {
                callBack(err);
                return console.error(err);
            }

            var msdata = new MSData({
                fileref: data.toString(),
                title: metadata.title,
                mainPanel: mainPanelContent,
                generatedContent: metadata.content,
                pageNum: metadata.pageNum
            });

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