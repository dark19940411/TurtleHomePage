require('./utilities');

function RenderBufferPool() {
    var self = this;
    self.bloglistBufferPool = [];
    self.articleBufferPool = [];
    self.blogsListDataPreparedEventName = 'blogsListDataPreparedEvent';

    var EventEmitter = require('events').EventEmitter;
    self.evem = new EventEmitter();
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

        var lastPageArticleNum = articlesChain.length % __blogsPerPage;
        if(currentGeneratedBlogListIndex === 0 && lastPageArticleNum > 0) {       //博客的最后一页，且最后一页的文章数量大于0
            if (self.bloglistBufferPool.length === lastPageArticleNum) {
                self.bloglistBufferPool.reverse();
                self.evem.emit(self.blogsListDataPreparedEventName, self.bloglistBufferPool, blogslistPagesCount, blogslistPagesCount - currentGeneratedBlogListIndex);
                self.bloglistBufferPool = [];
                currentGeneratedBlogListIndex++;
            }
        }
        else {
            if (self.bloglistBufferPool.length === __blogsPerPage) {
                self.bloglistBufferPool.reverse();
                self.evem.emit(self.blogsListDataPreparedEventName, self.bloglistBufferPool, blogslistPagesCount, blogslistPagesCount - currentGeneratedBlogListIndex);
                self.bloglistBufferPool = [];
                currentGeneratedBlogListIndex++;
            }
        }
    };
}

module.exports = new RenderBufferPool();