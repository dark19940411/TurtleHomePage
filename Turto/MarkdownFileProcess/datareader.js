/**
 * Created by turtle on 2017/11/9.
 */
require('./../Tools/utilities');

function DataReader() {

    var grayMatter = require("gray-matter");
    var fs = require("fs");
    var postspath = __postdir;
    var RegularizedArticleMetaData = require('./RegularizedArticleMetaData');
    var MarkdownFileTransformer = require('./MarkdownFileTransformer');
    var pdenumerator = require('../Tools/postsdir-enumerator');
    var task = require('../Tools/task');

    this.readIn = function (eachFileContentCallBack) {
        articlesChain.forEach(function (item, idx) {
            task.do('Reading article file named: ' + item.title, function () {
                var fullpath = __postdir.stringByAppendingPathComponent(item.title);
                fullpath = fullpath.stringByAppendingPathComponent(item.title + '.md');
                try {
                    var data = fs.readFileSync(fullpath);
                    var metadata = new RegularizedArticleMetaData(grayMatter(data.toString()));
                    var transformer = new MarkdownFileTransformer();
                    metadata = transformer.transform(metadata);

                    //将date转换成可读性字符串
                    // var date = new Date(metadata.date);
                    // var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay()  + '  '
                    //     + date.getHours() + ': ' + date.getMinutes();
                    // metadata.date = dateStr;
                    metadata.date = String(metadata.date).replace(' GMT+0800 (CST)', '');

                    eachFileContentCallBack(fullpath, metadata, idx, articlesChain);
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
}

module.exports = DataReader;