Array.prototype.__insert = function (item) {        //二分型插入算法
    if (this.length < 1) {
        this[0] = item;
    }
    else {
        var head = 0;
        var tail = this.length - 1;
        while (tail - head > 1) {
            var idx = Math.floor((head + tail)/2);
            // console.log('head: ' + head + '\n'
            //     + 'tail: ' + tail + '\n'
            //     + 'idx: ' + idx + '\n');
            // var selectedobj = this[idx];
            if (item.date < selectedobj.date) {
                tail = idx;
            } else {
                head = idx;
            }
        }
        var obj = this[head];
        if (item.date <= obj.date) {
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
    var self = this;
    this.chain = [];

    this.build = function (callback) {
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
                self.chain.__insert(chainItem);
            });
        }, function () {
            callback(self.chain);
        });
    }
}

module.exports = ArticleChainsBuilder;