function PostsDirEnumerator() {
    require('./utilities');
    var fs = require('fs');
    this.forEach = function (callback) {
        fs.readdir(__postdir, function (err, files) {
            if (err) {
                return console.error(err);
            }
            files.forEach(function(foldername) {
                var fullpath = __postdir.stringByAppendingPathComponent(foldername);
                fullpath = fullpath.stringByAppendingPathComponent(foldername + '.md');
                if (!fs.existsSync(fullpath)) {return;}

                callback(fullpath);
            });
        });
    }
}

module.exports = new PostsDirEnumerator();