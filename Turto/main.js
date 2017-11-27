/**
 * Created by turtle on 2017/11/8.
 */
var Generator = require('./Tools/generator');
var path = require('path');
var fs = require('fs-extra');

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] == 'g' || argv._[0] == 'generate') {

        prepareForBuild();

        console.log('generating pages...');
        var generator = new Generator();
        generator.generate();
    }
}());

function prepareForBuild() {
    console.log('prepare for building...');
    moveNodeModulesDirToBuild();
}

function moveNodeModulesDirToBuild() {
    console.log('copy node_modules into build directory...');
    fs.copy(path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../build/node_modules'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('copy completed...');
    });
}