'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

// sass编译
gulp.task('sass', function() {
    return gulp.src('./assets/src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist'));
});

// js编译
gulp.task('distJs', function() {
    return gulp.src('./assets/src/js/*.js')
        .pipe(gulp.dest('./dist'));
});

// html编译
gulp.task('distHTML', function() {
    return gulp.src('./assets/index.html')
        .pipe(gulp.dest('./dist'));
});

// sass编译监听
gulp.task('sass:watch', function() {
    gulp.watch('./assets/src/sass/*.scss', ['sass']);
    gulp.watch('./assets/src/js/*.js', ['distJs']);
    gulp.watch('./assets/*.html', ['distHTML']);
});


