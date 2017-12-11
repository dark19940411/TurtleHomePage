require('./utilities');

function RenderBufferPool() {
    var self = this;
    self.bloglistBufferPool = [];
    self.articleBufferPool = [];
    self.blogsListDataPreparedEventName = 'blogsListDataPreparedEvent';

    var EventEmitter = require('events').EventEmitter;
    var evem = new EventEmitter();
    var blogslistPagesCount = Math.ceil(articlesChain.length / __blogsPerPage);
    var currentGeneratedBlogListIndex = 0;

    this.articlePoolPush = function (item) {
        if (self.articleBufferPool.length == 0) {
            self.articleBufferPool.push(item);
            return;
        }

        var lastItem = self.articleBufferPool[self.articleBufferPool.length - 1];
        lastItem.latterItem = item;
        item.formerItem = lastItem; //创造了循环引用，所以当释放时，必须得断开这两条链才行
        self.articleBufferPool.push(item);

        if(self.articleBufferPool.length > 3) {   //缓冲池里Item数量大于3时，最靠前的item必然已经被渲染
            self.articleBufferPool[0].latterItem = null;
            self.articleBufferPool[1].formerItem = null;
            self.articleBufferPool.splice(0, 1);
        }
    };

    this.shouldRenderArticleItem = function () {
        if (self.articleBufferPool.length > 1) {
            return self.articleBufferPool[self.articleBufferPool.length - 2];
        }
        else {
            return null;
        }
    };

    this.clearArticleBufferPool = function () {
        self.articleBufferPool.forEach(function (value, idx) {
            value.formerItem = null;
            value.latterItem = null;

            if (idx === self.articleBufferPool.length - 1) {
                self.articleBufferPool.splice(0, self.articleBufferPool.length);
            }
        });
    };

    this.bloglistPoolPush = function (item) {
        self.bloglistBufferPool.push(item);
        if(currentGeneratedBlogListIndex === 0) {
            var lastPageArticleNum = articlesChain.length % __blogsPerPage;
            if (self.bloglistBufferPool.length === lastPageArticleNum) {
                evem.emit(self.blogsListDataPreparedEventName, self.bloglistBufferPool, blogslistPagesCount - currentGeneratedBlogListIndex);
                self.bloglistBufferPool = [];
            }
        }
        else {
            if (self.bloglistBufferPool.length === __blogsPerPage) {
                evem.emit(self.blogsListDataPreparedEventName, self.bloglistBufferPool, blogslistPagesCount - currentGeneratedBlogListIndex);
                self.bloglistBufferPool = [];
            }
        }
    };
}

module.exports = new RenderBufferPool();