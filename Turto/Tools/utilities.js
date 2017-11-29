/**
 * Created by turtle on 2017/11/8.
 */

var path = require('path');

(function ArrayExtension() {
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
}());

(function StringExtension() {
    String.prototype.stringByAppendingPathComponent = function (component) {
        return this + '/' + component;
    }

    String.prototype.lastPathcomponent = function () {
        return this.replace(path.dirname(String(this)) + '/', '');
    }
}());

global.__builddir = path.resolve(__dirname, '../../build');
global.__buildingBlogPostDir = __builddir.stringByAppendingPathComponent('blogpost');
global.__buildingTemplateDir = __builddir.stringByAppendingPathComponent('Template');

global.__postdir = path.resolve(__dirname, '../../Posts');

global.__distdir = path.resolve(__dirname, '../../dist');
