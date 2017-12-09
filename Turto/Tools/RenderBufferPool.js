function RenderBufferPool() {
    var self = this;
    self.bloglistBufferPool = [];
    self.articleBufferPool = [];
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

    this.lastArticleItem = function () {
        if (self.articleBufferPool.length > 0) {
            return self.articleBufferPool[self.articleBufferPool.length - 1];
        }
        else {
            return null;
        }
    }

    this.shouldRenderArticleItem = function () {
        if (self.articleBufferPool.length > 1) {
            return self.articleBufferPool[self.articleBufferPool.length - 2];
        }
        else {
            return null;
        }
    }
}

module.exports = new RenderBufferPool();