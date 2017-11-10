/**
 * Created by turtle on 2017/11/10.
 */

function RegularizedArticleMetaData(metadata) {
    this.title = metadata.data.title;
    this.date = metadata.data.date;
    this.tags = metadata.data.tags;
    this.content = metadata.content;
}

module.exports = RegularizedArticleMetaData;