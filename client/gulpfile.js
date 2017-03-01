var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8000
  })
})

gulp.task('reload', function () {
  gulp.src('app/**/*.*')
    .pipe(connect.reload())
});

gulp.task('watch', function () {
  gulp.watch(['app/*.*', 'app/js/*.*', 'app/css/*.*'], ['reload'])
})

gulp.task('default', ['connect', 'watch'])