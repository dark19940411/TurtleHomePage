function GenerationProgressManager() {
    var totalBlogsListPagesCount = Math.ceil(articlesChain.length / __blogsPerPage);
    var generatedBlogsListPagesCount = 0;
    var generatedBlogPostPagesCount = 0;

    this.signalOneBLPageCompleted = function () {
        generatedBlogsListPagesCount++;
    };

    this.signalOneBPPageCompleted = function () {
        generatedBlogPostPagesCount++;
    };

    this.blGenerationProgress = function () {
        return generatedBlogsListPagesCount / totalBlogsListPagesCount;
    };

    this.bpGenerationProgress = function () {
        return generatedBlogPostPagesCount / articlesChain.length;
    };

    this.totalProgress = function () {
        return (generatedBlogPostPagesCount + generatedBlogsListPagesCount) / (totalBlogsListPagesCount + articlesChain.length);
    };

    this.isBlGenerationCompleted = function () {
        return generatedBlogsListPagesCount === totalBlogsListPagesCount;
    };

    this.isBpGenerationCompleted = function () {
        return generatedBlogPostPagesCount === articlesChain.length;
    };

    this.isGenerationCompleted = function () {
        return this.isBlGenerationCompleted() && this.isBpGenerationCompleted();
    };
}

module.exports = new GenerationProgressManager();