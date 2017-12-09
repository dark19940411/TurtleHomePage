function RenderBufferItem(options) {
    this.title = options.title;
    this.date = option.date;
    this.brev = options.brev;//摘要
    this.formerItem = options.formerItem;
    this.latterItem = options.latterItem;
    this.didRender = false;
}

module.exports = RenderBufferItem;