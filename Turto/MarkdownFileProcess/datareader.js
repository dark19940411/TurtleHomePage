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

    this.readIn = function (eachFileContentCallBack) {
        articlesChain.forEach(function (item, idx) {
            var fullpath = __postdir.stringByAppendingPathComponent(item.title);
            fullpath = fullpath.stringByAppendingPathComponent(item.title + '.md');
            fs.readFile(fullpath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var metadata = new RegularizedArticleMetaData(grayMatter(data.toString()));
                var transformer = new MarkdownFileTransformer();
                metadata = transformer.transform(metadata);
                eachFileContentCallBack(fullpath, metadata);
            });
        });
    }
}

module.exports = DataReader;