/**
 * Created by turtle on 2017/11/23.
 */
var gulp = require('gulp');

gulp.task('Move-libraries', function () {
    gulp.src("Template/libraries")
        .pipe(gulp.dest("dist"));
});

gulp.task('Turto', function () {
    require('Turto/main');
});