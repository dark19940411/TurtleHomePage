/**
 * Created by turtle on 2017/11/23.
 */
var gulp = require('gulp');

gulp.task('default', function() {
    // place code for your default task here
    gulp.src("Template/libraries")
        .pipe(gulp.dest("dist"));
});