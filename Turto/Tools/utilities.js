/**
 * Created by turtle on 2017/11/8.
 */

var path = require('path');
var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    title: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

(function ArrayExtension() {
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
}());

(function StringExtension() {
    String.prototype.stringByAppendingPathComponent = function (component) {
        return this + '/' + component;
    };

    String.prototype.lastPathcomponent = function () {
        return this.replace(path.dirname(String(this)) + '/', '');
    };

    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    }
}());

global.__builddir = path.resolve(__dirname, '../../build');
global.__buildingBlogPostDir = __builddir.stringByAppendingPathComponent('blogpost');
global.__buildingTemplateDir = __builddir.stringByAppendingPathComponent('Template');

global.__postdir = path.resolve(__dirname, '../../Posts');
global.__nodemodulesdir = path.resolve(__dirname, '../../node_modules');

global.__distdir = path.resolve(__dirname, '../../dist');
global.__blogsPerPage = 10;
