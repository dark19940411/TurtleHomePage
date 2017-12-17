function Distributor() {
    require('./utilities');

    var gulp = require('gulp');
    // var useref = require('gulp-useref');
    // var uglify = require('gulp-uglify');
    var cleancss = require('gulp-clean-css');
    // var gulpif = require('gulp-if');
    var concat = require('gulp-concat');
    var fs = require('fs-extra');
    var task = require('./task');

    gulp.task('concat', function (cb) {
        task.do('concat and compress css and js', function (done) {
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
                    done()
                    cb();
                }))
                .pipe(gulp.dest(__builddir + '/assets/css'));
        });
    });

    gulp.task('buildimgs', function () {
        task.do('Move images from build/Template to build/assets', function () {
            gulp.src(__buildingTemplateDir.stringByAppendingPathComponent('images') + '/*', { base: __buildingTemplateDir.stringByAppendingPathComponent('images') })
                .pipe(gulp.dest(__builddir.stringByAppendingPathComponent('assets/images')));
        });
    });

    gulp.task('generate dist', ['concat', 'buildimgs'], function (cb) {
        function filterFunc(src, dest) {
            if (src === __builddir.stringByAppendingPathComponent('Template')) {
                return false;
            }
            return true;
        }
        task.do('generating dist folder...', function (done) {
            fs.copy(__builddir, __distdir, { filter: filterFunc }, function (err) {
                if (err) {
                    return console.error(err);
                }
                done();
                cb();
                console.log('Distribution is completed!'.green);
            });
        });
    });

    gulp.task('mkCNAME', function (cb) {
        var cnamepath = __distdir.stringByAppendingPathComponent('CNAME');
        fs.ensureFile(cnamepath, function (err) {
            if (err) {
                return console.error(err);
            }
            fs.writeFile(cnamepath, 'tech.imturtle.cn', function (err) {
                if (err) {
                    return console.error(err);
                }
                cb();
            })
        });
    });

    this.distribute = function () {
        gulp.start(['concat', 'buildimgs', 'generate dist', 'mkCNAME']);
    };
}

module.exports = new Distributor();