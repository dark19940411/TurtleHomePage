/**
 * Created by turtle on 2017/11/8.
 */
var Generator = require('./Tools/generator');

(function main() {
    var argv = require("minimist")(process.argv.slice(2));

    if (argv._[0] == 'g' || argv._[0] == 'generate') {
        var generator = new Generator();
        generator.generate();
    }
}());