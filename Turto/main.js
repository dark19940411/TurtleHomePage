/**
 * Created by turtle on 2017/11/8.
 */
require('./Tools/utilities');

var Generator = require('./Tools/generator');
var path = require('path');
var fs = require('fs-extra');
var task = require('./Tools/task');

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] === 'g' || argv._[0] === 'generate') {

        task.do('Clear last generated results', clearjob);

        var generator = new Generator();
        task.do('generating pages', generator.generate);
    }
}());

function clearjob() {
    fs.emptyDirSync(__buildingBlogPostDir);
    // moveNodeModulesDirToBuild();
}

function moveNodeModulesDirToBuild() {
    fs.copy(path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../build/node_modules'), function (err) {
        if (err) {
            return console.error(err);
        }
    });
}