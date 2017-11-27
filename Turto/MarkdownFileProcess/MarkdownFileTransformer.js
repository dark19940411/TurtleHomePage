/**
 * Created by turtle on 2017/11/10.
 */

function MarkdownFileTransformer() {
    var marked = require("marked");
    var hljs = require('highlight.js');
    this.startTransform = function (metadata, callback) {
        var renderer = new marked.Renderer();
        renderer.code = function (code, lang) {
            if (typeof lang === 'undefined') {
                var codecls = 'hljs ' + lang;
                return '<pre><code class="' + codecls + '">' + hljs.highlightAuto(code).value + '</code></pre>';
            } else if (lang === 'nohighlight') {
                return code;
            } else {
                var codecls = 'hljs ' + lang;
                return '<pre><code class="' + codecls + '">' + hljs.highlight(lang, code).value + '</code></pre>';
            }
        };
        marked.setOptions({
            renderer: renderer
        });
        metadata.content = marked(metadata.content);
        callback(metadata);
    };
}

module.exports = MarkdownFileTransformer;