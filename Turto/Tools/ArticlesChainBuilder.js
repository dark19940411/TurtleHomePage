Array.prototype.__insert = function (item) {        //二分型插入算法
    if (this.length < 1) {
        this[0] = item;
    } else if (this.length === 1) {
        if (item.date < this[0].date) {
            this.splice(0, 0, item);
        } else  {
            this.splice(1, 0, item);
        }
    }
    else {
        var head = 0;
        var tail = this.length - 1;
        while (tail - head > 1) {
            var idx = Math.floor((head + tail)/2);
            //console.log('enumeration starts.'.red);
            //console.log('head: ' + head + '\n'
            //     + 'tail: ' + tail + '\n'
            //     + 'idx: ' + idx + '\n');
            var selectedobj = this[idx];
            if (item.date < selectedobj.date) {
                //console.log(item.date + ' < ' + selectedobj.date);
                tail = idx;
            } else {
                //console.log(item.date + ' >= ' + selectedobj.date);
                head = idx;
            }
        }

        //console.log('head: ' + head + '\n'
        // + 'tail: ' + tail);
        if (tail === head) {
            //console.log('insert place: '.red + head);
            this.splice(head, 0, item);
            //console.log(this);
        } else {
            if (item.date < this[head].date) {
                this.splice(head, 0, item);
                //console.log('insert place: '.red + head);
            } else if(item.date > this[tail].date) {
                this.splice(tail + 1, 0, item);
                //console.log('insert place: '.red + (tail + 1));
            } else {
                this.splice(tail, 0, item);
                //console.log('insert place: '.red + tail);
            }
        }
    }
};

function ArticleChainsBuilder() {
    require('./utilities');
    var pdenumerator = require('./postsdir-enumerator');
    var fs = require('fs');
    var grayMatter = require("gray-matter");
    var self = this;
    var ArticleChainItem = require("../Model/ArticleChainItem");
    this.chain = [];

    this.build = function (callback) {
        var count = 0;
        pdenumerator.forEach(function (fullpath, index, titles) {
            fs.readFile(fullpath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var obj = grayMatter(data.toString());
                var chainItem = new ArticleChainItem({
                    title: obj.data.title,
                    date: Date.parse(obj.data.date)
                });
                self.chain.__insert(chainItem);

                count++;

                if (count === titles.length && callback) {
                    callback(self.chain);
                }
            });
        });
    }
}

module.exports = ArticleChainsBuilder;