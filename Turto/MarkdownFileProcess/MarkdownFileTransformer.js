/**
 * Created by turtle on 2017/11/10.
 */

function MarkdownFileTransformer() {
    var marked = require("marked");
    var hljs = require('highlight.js');
    var cheerio = require('cheerio');

    function getBreviaryOfArticleContent(content) {
        var $ = cheerio.load(content);
        return $('p').text().substring(0, 250) + '……';
    }

    this.transform = function (metadata) {
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

        renderer.image = function (href, title) {
            return '<img class="content-img" src="' + href + '" alt="' + title + '">';
        };
        marked.setOptions({
            renderer: renderer
        });
        metadata.content = marked(metadata.content);
        metadata.brev = getBreviaryOfArticleContent(metadata.content);

        return metadata;
    };
}

module.exports = MarkdownFileTransformer;