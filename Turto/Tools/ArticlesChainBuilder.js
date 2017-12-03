Array.prototype.__insert = function (item) {        //二分型插入算法
    if (this.length < 1) {
        this[0] = item;
    }
    else {
        var head = 0;
        var tail = this.length - 1;
        while (head != tail) {
            var idx = Math.floor((head + tail)/2);
            var selectedobj = this[idx];
            if (item.date < selectedobj.date) {
                tail = idx;
            } else {
                head = idx;
            }
        }
        var obj = this[head];
        if (item.date < obj.date) {
            this.splice(head, 0, item);
        } else {
            this.splice(head + 1, 0, item);
        }
    }
};

function ArticleChainsBuilder() {
    require('./utilities');
    var pdenumerator = require('./postsdir-enumerator');
    var fs = require('fs');
    var grayMatter = require("gray-matter");

    this.chain = [];

    this.build = function () {
        pdenumerator.forEach(function (fullpath) {
            fs.readFile(fullpath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var obj = grayMatter(data.toString());
                var chainItem = {
                    title: obj.title,
                    date: Date.parse(obj.date)
                };

            });
        });
    }
}

module.exports = ArticleChainsBuilder;