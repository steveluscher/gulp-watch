'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('./index');

// require('longjohn');

gulp.task('watch', function (cb) {
    gulp.src(['./test/watch.js', 'index.js'], { read: false })
        .pipe(watch(function (events, cb) {
            gulp.src(['./test/watch.js'])
                .pipe(mocha({ timeout: 5000, reporter: 'spec' }))
                .on('error', function (err) {
                    console.log(err.toString());
                    cb();
                })
                .on('end', cb);
        }))
        .on('end', cb);
});

gulp.task('default', function (cb) {
    gulp.run('watch', cb);
});
