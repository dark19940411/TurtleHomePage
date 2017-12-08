function ArticleRenderBufferPool() {
    var pool = [];
    this.push = function (item) {
        if (pool.length == 0) {
            pool.push(item);
            return;
        }

        var lastItem = pool[pool.length - 1];
        lastItem.latterItem = item;
        item.formerItem = lastItem; //创造了循环引用，所以当释放时，必须得断开这两条链才行
        pool.push(item);

        if(pool.length > 3) {   //缓冲池里Item数量大于3时，最靠前的item必然已经被渲染
            pool[0].latterItem = null;
            pool[1].formerItem = null;
            pool.splice(0, 1);
        }
    }


}