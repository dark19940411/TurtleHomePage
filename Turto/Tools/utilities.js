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
        return this.replace(path.dirname(this) + '/', '');
    }
}());
