/**
 * Created by turtle on 2017/11/9.
 */
require('./../Tools/utilities');

function DataReader() {

    var grayMatter = require("gray-matter");
    var fs = require("fs");
    var path = require('path');
    var postspath = path.resolve(__dirname, '../../Posts');
    var RegularizedArticleMetaData = require('./RegularizedArticleMetaData');
    var MarkdownFileTransformer = require('./MarkdownFileTransformer');

    this.readIn = function (eachFileContentCallBack) {
        fs.readdir(postspath, function (err, files) {
            if (err) {
                return console.error(err);
            }
            files.forEach(function(file) {
                var fullpath = postspath.stringByAppendingPathComponent(file);
                fs.readFile(fullpath, function (err, data) {
                    var metadata = new RegularizedArticleMetaData(grayMatter(data.toString()));
                    var transformer = new MarkdownFileTransformer();
                    transformer.startTransform(metadata, eachFileContentCallBack);
                });
            });
        });
    }

}

module.exports = DataReader;