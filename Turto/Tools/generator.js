/**
 * Created by turtle on 2017/11/8.
 */
require('./utilities');

function Generator() {
    var DataReader = require('./../MarkdownFileProcess/datareader');

    this.generate = function () {
        var datareader = new DataReader();
        datareader.readIn(function(metadata) {
            console.log(metadata);
        });
    }
}

module.exports = Generator;