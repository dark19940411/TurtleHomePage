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
var matter = require('gray-matter');

var clearjobfinshed = false;
var buildchainjobfinshed = false;

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] === 'g' || argv._[0] === 'generate' || argv.generate) {   //生成网站流程

        startClearProcess();

        task.do('build articles chain', function (done) {
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

            fs.ensureFile(newarticlepath, function (err) {
                if (err) {
                    return console.error(err);
                }
                var frontMatter = matter.stringify('', {title: title, date: new Date()});
                fs.writeFile(newarticlepath, frontMatter, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    currentEnsureIndex++;
                    if (currentEnsureIndex === ensureCount) {
                        console.log(String('Finished creating article "' + title + '" at ' + newarticlepath).green);
                    }
                })
            });
            fs.ensureDir(path.dirname(newarticlepath).stringByAppendingPathComponent('images'), function (err) {
                if (err) {
                    return console.error(err);
                }
                currentEnsureIndex++;
                if (currentEnsureIndex === ensureCount) {
                    console.log(String('Finished creating article "' + title + '" at ' + newarticlepath).green);
                }
            });
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

    fs.emptyDir(__builddir.stringByAppendingPathComponent('assets'), unitedClosure);

    fs.readdir(__distdir, function (err, files) {
        var removedItemsCount = 0;
        files.forEach(function (value) {
            if (value !== '.git') {
                var filepath = __distdir.stringByAppendingPathComponent(value);
                fs.remove(filepath, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    removedItemsCount++;
                    if (removedItemsCount === files.length - 1) {
                        unitedClosure(err);
                    }
                });
            }
            if (removedItemsCount === files.length - 1) {
                unitedClosure(err);
            }
        });
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

function formatDate(date,format){
    var paddNum = function(num){
        num += "";
        return num.replace(/^(\d)$/,"0$1");
    };
    //指定格式字符
    var cfg = {
        yyyy : date.getFullYear() //年 : 4位
        ,yy : date.getFullYear().toString().substring(2)//年 : 2位
        ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
        ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        ,d  : date.getDate()   //日 : 如果1位的时候不补0
        ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
        ,hh : date.getHours()  //时
        ,mm : date.getMinutes() //分
        ,ss : date.getSeconds() //秒
    };
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
}