function RenderBufferItem(options) {
    this.title = options.title;
    this.date = options.date;
    this.brev = options.brev;//摘要
    this.formerItem = options.formerItem;
    this.latterItem = options.latterItem;
}

module.exports = RenderBufferItem;