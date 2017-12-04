function PostsDirEnumerator() {
    require('./utilities');
    var fs = require('fs');
    this.forEach = function (eachcb, completioncb) {
        fs.readdir(__postdir, function (err, titles) {
            if (err) {
                return console.error(err);
            }

            filterNonexistentTitles(titles);

            titles.forEach(function(title, index) {
                var fullpath = __postdir.stringByAppendingPathComponent(title);
                fullpath = fullpath.stringByAppendingPathComponent(title + '.md');

                eachcb(fullpath, index, titles);

                if (index === titles.length - 1 && completioncb) {
                    completioncb();
                }
            });
        });
    }

    function filterNonexistentTitles(titles) {
        titles.forEach(function (title, index) {
            var fullpath = __postdir.stringByAppendingPathComponent(title);
            fullpath = fullpath.stringByAppendingPathComponent(title + '.md');
            if (!fs.existsSync(fullpath)) { titles.splice(index, 1); }
        });
    }
}

module.exports = new PostsDirEnumerator();