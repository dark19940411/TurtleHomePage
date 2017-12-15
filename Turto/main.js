/**
 * Created by turtle on 2017/11/8.
 */
require('./Tools/utilities');

var Generator = require('./Tools/Generator');
var path = require('path');
var fs = require('fs-extra');
var task = require('./Tools/task');
var ArticlesChainBuilder = require('./Tools/ArticlesChainBuilder');
var distributor = require('./Tools/distributor');

var clearjobfinshed = false;
var buildchainjobfinshed = false;

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] === 'g' || argv._[0] === 'generate') {

        task.do('Clear last generated results', function (done) {
            clearjob(function () {
                clearjobfinshed = true;
                done();
                setupGenerationTask();
            });
        });

        task.do('build article chain', function (done) {
            var builder = new ArticlesChainBuilder();
            builder.build(function (chain) {
                global.articlesChain = chain;
                buildchainjobfinshed = true;
                done();
                setupGenerationTask();
            });
        });
    }
}());

function clearjob(callback) {
    var totalJobsCount = 2;
    var finishedJobsCount = 0;
    fs.emptyDir(__buildingBlogPostDir, function (err) {
        if (err) {
            return console.error(err);
        }
        finishedJobsCount++;
        if (finishedJobsCount === totalJobsCount) {
            callback();
        }
    });

    fs.emptyDir(__builddir.stringByAppendingPathComponent('bloglistpages'), function (err) {
        if (err) {
            return console.error(err);
        }
        finishedJobsCount++;
        if (finishedJobsCount === totalJobsCount) {
            callback();
        }
    });
    // moveNodeModulesDirToBuild();
}

function moveNodeModulesDirToBuild() {
    fs.copy(path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../build/node_modules'), function (err) {
        if (err) {
            return console.error(err);
        }
    });
}

function setupGenerationTask() {
    if (clearjobfinshed && buildchainjobfinshed) {
        var generator = new Generator();
        task.do('generating pages', function (done) {
            generator.generate(function () {
                done();
                distributor.distribute();
            });
        });
    }
}