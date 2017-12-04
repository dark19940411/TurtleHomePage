function PostsDirEnumerator() {
    require('./utilities');
    var fs = require('fs');
    this.forEach = function (eachcb, completioncb) {
        fs.readdir(__postdir, function (err, files) {
            if (err) {
                return console.error(err);
            }
            files.forEach(function(foldername, index) {
                var fullpath = __postdir.stringByAppendingPathComponent(foldername);
                fullpath = fullpath.stringByAppendingPathComponent(foldername + '.md');
                if (!fs.existsSync(fullpath)) {return;}

                eachcb(fullpath);

                if (index === files.length - 1 && completioncb) {
                    completioncb();
                }
            });
        });
    }
}

module.exports = new PostsDirEnumerator();