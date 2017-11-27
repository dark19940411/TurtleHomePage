/**
 * Created by turtle on 2017/11/10.
 */

function MarkdownFileTransformer() {
    var marked = require("marked");
    var hljs = require('highlight.js');
    this.startTransform = function (metadata, callback) {
        marked.setOptions({
            highlight: function(code, lang) {
                if (typeof lang === 'undefined') {
                    return hljs.highlightAuto(code).value;
                } else if (lang === 'nohighlight') {
                    return code;
                } else {
                    return hljs.highlight(lang, code).value;
                }
            }
        });
        metadata.content = marked(metadata.content);
        callback(metadata);
    };
}

module.exports = MarkdownFileTransformer;