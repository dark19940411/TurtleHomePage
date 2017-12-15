function Distributor() {
    require('./utilities');

    var gulp = require('gulp');
    var useref = require('gulp-useref');
    var uglify = require('gulp-uglify');
    var cleancss = require('gulp-clean-css');
    var gulpif = require('gulp-if');
    var concat = require('gulp-concat');

    gulp.task('concat', function () {
        var poperjspath = __nodemodulesdir + '/popper.js/dist/popper.min.js';
        var jqpath = __nodemodulesdir + '/jquery/dist/jquery.min.js';
        var bootstrapjspath = __nodemodulesdir + '/bootstrap/dist/js/bootstrap.min.js';
        gulp.src([poperjspath, jqpath, bootstrapjspath])
            .pipe(concat('main.js', { newline: '\n' }))
            .pipe(gulp.dest(__builddir + '/assets/js'));

        
    });

    this.distribute = function () {
        gulp.start('concat');
    }
}

module.exports = new Distributor();