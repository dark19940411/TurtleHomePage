function Distributor() {
    require('./utilities');

    var gulp = require('gulp');
    // var useref = require('gulp-useref');
    // var uglify = require('gulp-uglify');
    var cleancss = require('gulp-clean-css');
    // var gulpif = require('gulp-if');
    var concat = require('gulp-concat');
    var fs = require('fs-extra');

    gulp.task('concat', function (cb) {
        var poperjspath = __nodemodulesdir + '/popper.js/dist/popper.min.js';
        var jqpath = __nodemodulesdir + '/jquery/dist/jquery.min.js';
        var bootstrapjspath = __nodemodulesdir + '/bootstrap/dist/js/bootstrap.min.js';
        gulp.src([poperjspath, jqpath, bootstrapjspath])
            .pipe(concat('main.js', { newline: '\n' }))
            .pipe(gulp.dest(__builddir + '/assets/js'));

        var bootstrapcsspath = __nodemodulesdir + '/bootstrap/dist/css/bootstrap.min.css';
        var highlightcsspath = __nodemodulesdir + '/highlight.js/styles/atom-one-dark.css';
        var mycsspath = __buildingTemplateDir + '/css/dev.css';
        gulp.src([bootstrapcsspath, highlightcsspath, mycsspath])
            .pipe(concat('main.css', {newline: '\n'}))
            .pipe(cleancss(function () {
                cb();
            }))
            .pipe(gulp.dest(__builddir + '/assets/css'));
    });

    gulp.task('buildimgs', function () {
        gulp.src(__buildingTemplateDir.stringByAppendingPathComponent('images') + '/*', { base: __buildingTemplateDir.stringByAppendingPathComponent('images') })
            .pipe(gulp.dest(__builddir.stringByAppendingPathComponent('assets/images')));
    });

    gulp.task('generate dist', ['concat', 'buildimgs'], function (cb) {
        function filterFunc(src, dest) {
            if (src === __builddir.stringByAppendingPathComponent('Template')) {
                return false;
            }
            return true;
        }
        fs.copy(__builddir, __distdir, { filter: filterFunc }, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('Distribution is completed!'.green);
            cb()
        })
    });

    this.distribute = function () {
        gulp.start(['concat', 'buildimgs', 'generate dist']);
    };
}

module.exports = new Distributor();