function BlogsListPageViewModel() {

    // 生成渲染完整的博客列表页面所需要的数据
    this.formMainStructureRenderData = function (renderBufItem, mainPanelContent, callBack) {
        var filerefpath = __buildingTemplateDir.stringByAppendingPathComponent('blogs_list_fileref');
        fs.readFile(filerefpath, function (err, data) {
            if (err) {
                callBack(err);
                return console.error(err);
            }

            var msdata = new MSData({
                fileref: data.toString(),
                title: renderBufItem.title,
                mainPanel: mainPanelContent,
                generatedContent: renderBufItem.content
            });

            callBack(null, msdata);
        });
    }


}

module.exports = BlogsListPageViewModel;