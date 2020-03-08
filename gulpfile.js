'use strict';

// Require
var gulp = require('gulp'),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    nano = require('gulp-cssnano');

// Minfiy css
gulp.task('uncss', function() {
    return gulp.src('downloads/static/css/screen.css')
        .pipe(uncss({
            ignore: ['#added_at_runtime',
                '_site/2016/05/starry-starry-night/index.html',
                '_site/posts/',
                '_site/2014/04/edward-gorey/index.html',
                '_site/2015/02/let-me-show-you-the-world/index.html',
                '_site/2014/12/lonely-christmas-with-css/index.html',
                '_site/2016/09/computer-vision-syndrome/index.html',
                '_site/2014/11/7-principles-of-rich-web-applications/index.html',
                '_site/2016/10/'],
            html: ['_site/**/*.html']
        }))
        // .pipe(nano())
        .pipe(rename('min.css'))
        .pipe(gulp.dest('css/'));
});