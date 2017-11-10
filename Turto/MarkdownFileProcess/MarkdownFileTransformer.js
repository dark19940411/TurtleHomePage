/**
 * Created by turtle on 2017/11/10.
 */

function MarkdownFileTransformer() {
    var marked = require("marked");
    this.startTransform = function (metadata, callback) {
        metadata.content = marked(metadata.content);
        callback(metadata);
    };
}

module.exports = MarkdownFileTransformer;