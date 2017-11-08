/**
 * Created by turtle on 2017/11/8.
 */
require("./utilities");

var argv = require("minimist")(process.argv.slice(2));
var marked = require("marked");
var grayMatter = require("gray-matter");

if (argv._[0] == 'g' || argv._[0] == 'generate') {

}