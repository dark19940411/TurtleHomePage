/**
 * Created by turtle on 2017/11/8.
 */
require('./Tools/utilities');

var Generator = require('./Tools/Generator');
var fs = require('fs-extra');
var task = require('./Tools/task');
var ArticlesChainBuilder = require('./Tools/ArticlesChainBuilder');
var distributor = require('./Tools/distributor');
var path = require('path');

var clearjobfinshed = false;
var buildchainjobfinshed = false;

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] === 'g' || argv._[0] === 'generate' || argv.generate) {   //生成网站流程

        startClearProcess();

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
    else if (argv._[0] === 'c' || argv._[0] === 'clear' || argv.clear) {    //清理生成的内容流程
        startClearProcess();
    }
    else if (argv._[0] === 'n' || argv._[0] === 'new' || argv.new) {    //新建文章流程
        var title = null;
        if (argv.new) {
            title = argv.new;
        }
        else {
            title = argv._[1];
        }

        var newarticlepath = __postdir.stringByAppendingPathComponent(title)
            .stringByAppendingPathComponent(title + '.md');
        if(fs.existsSync(newarticlepath)) {
            return console.log('This article is already existed, please change its title...'.red);
        }
        else {
            var ensureCount = 2;
            var currentEnsureIndex = 0;
            function createJobDoneCheck(err) {
                if (err) {
                    return console.error(err);
                }
                currentEnsureIndex++;
                if (currentEnsureIndex === ensureCount) {
                    console.log(String('Finished creating article "' + title + '" at ' + newarticlepath).green);
                }
            }

            fs.ensureFile(newarticlepath, createJobDoneCheck);
            fs.ensureDir(path.dirname(newarticlepath).stringByAppendingPathComponent('images'), createJobDoneCheck);
        }
    }
}());

function startClearProcess() {
    task.do('Clear last generated results', function (done) {
        clearjob(function () {
            clearjobfinshed = true;
            done();
            setupGenerationTask();
        });
    });
}

function clearjob(callback) {
    var totalJobsCount = 4;
    var finishedJobsCount = 0;

    function unitedClosure(err) {
        if (err) {
            return console.error(err);
        }
        finishedJobsCount++;
        if (finishedJobsCount === totalJobsCount) {
            callback();
        }
    }

    fs.emptyDir(__buildingBlogPostDir, unitedClosure);

    fs.emptyDir(__builddir.stringByAppendingPathComponent('bloglistpages'), unitedClosure);

    fs.emptyDir(__distdir, unitedClosure);

    fs.emptyDir(__builddir.stringByAppendingPathComponent('assets'), unitedClosure);
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