# [gulp](https://github.com/gulpjs/gulp)-watch [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status](https://coveralls.io/repos/floatdrop/gulp-watch/badge.png)](https://coveralls.io/r/floatdrop/gulp-watch) [![Dependency Status][depstat-image]][depstat-url]
> Watch, that actually is an endless stream

One picture is worth a thousand words:

![Awesome demonstration](https://github.com/floatdrop/gulp-watch/raw/master/img/2014-01-09.gif)

## Usage

### Continious stream of events

This is usefull, when you want blazingly fast rebuilding per-file.

__Be aware:__ `end` event is never happens in this mode, so plugins dependent on it will never print or do whatever they should do on `end` task.

```js
// npm i gulp gulp-watch gulp-sass

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass');

gulp.task('default', function () {
    gulp.src('scss/**', { read: false })
        .pipe(watch())
        .pipe(plumber()) // This will pipes working after error event
        .pipe(sass())
        .pipe(gulp.dest('./dist/'));
});
```

If you want to watch all directories, include those, which will be __created__ after:

```js
gulp.task('default', function () {
    watch({ glob: 'sass/**/*.scss' })
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./dist/'));
});
```

### Trigger for mocha

[Problem with `gulp.watch`](https://github.com/gulpjs/gulp/issues/80) is that will run your test suit on every changed file per once. To avoid this [`gulp-batch`](https://github.com/floatdrop/gulp-batch) was written first, but after some time it became clear, that `gulp.watch` should be a plugin with event batching abilities.

```js
var grep = require('gulp-grep-stream');
var mocha = require('gulp-mocha');

gulp.task('watch', function() {
    gulp.src(['lib/**', 'test/**'], { read: false })
        .pipe(watch({ emit: 'all' }))
        .pipe(grep('*/test/*.js'))
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', function() {
            if (!/tests? failed/.test(err.stack)) {
                console.log(err.stack);
            }
        });
});

gulp.task('default', function () {
    gulp.run('watch');
});

// run `gulp watch` or just `gulp` for watching and rerunning tests
```

## API

### watch([options, callback])

This function creates have two different modes, that are depends on have you provice callback function, or not. If you do - you get __batched__ mode, if you not - you get __stream__.

### Callback signature: `function(events, [done])`

 * `events` - is `Array` of incoming events.
 * `done` - is callback for your function signal to batch, that you are done. This allows to run your callback as soon as previous end.

### Options:

This object passed to [`gaze` options](https://github.com/shama/gaze#properties) directly, so see documentation there. For __batched__ mode we are using [`gulp-batch`](https://github.com/floatdrop/gulp-batch#api), so options from there are available. And of course options for [`gulp.src`](https://github.com/gulpjs/gulp#gulpsrcglobs-options) used too. If you do not want content from watch, then add `read: false` to options object.

#### options.emit
Type: `String`
Default: `one`

This options defines emit strategy:

 * `one` - emit only changed file
 * `all` - emit all watched files (and folders), when one changes

#### options.passThrough
Type: `Boolean`  
Default: `true`

This options will pass vinyl objects, that was piped into `watch` to next Stream in pipeline.

#### options.glob
Type: `String`  
Default: `undefined`

If you want to detect new files, then you have to use this option. When `gulp-watch` gets files from `gulp.src` it looses the information about pattern of matching - therefore it can not detect new files.

#### options.name
Type: `String`  
Default: `undefined`

Name of the watcher. If it present in options, you will get more readable output:

![Naming watchers](https://github.com/floatdrop/gulp-watch/raw/master/img/naming.png)

__Notes__: 
 
1. you cannot pipe to watcher, that got this option (writable stream will be closed).
2. you will receive vinyl File object only on changes.

### Methods

Returned Stream from constructor have some useful methods:

 * `close()` - calling `gaze.close` and emitting `end`, after `gaze.close` is done.

### Events

 * `end` - all files are stop being watched.
 * `ready` - all files, that are passed from `gulp.src`, are now being watched.
 * `error` - when something happened inside callback, you will get notified.

### Properties

 * `gaze` - instance of `gaze` in case you want to call it methods (for example `remove`). Be aware __no one guarantee you nothing__ after you hacked on `gaze`.

### Returns

 * __Batched mode__  - wrapped callback, that will gather events and call callback.
 * __Stream mode__ - stream, that handles `gulp.src` piping.

# License

(MIT License)

Copyright (c) 2013 Vsevolod Strukchinsky (floatdrop@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://npmjs.org/package/gulp-watch
[npm-image]: https://badge.fury.io/js/gulp-watch.png

[travis-url]: http://travis-ci.org/floatdrop/gulp-watch
[travis-image]: https://travis-ci.org/floatdrop/gulp-watch.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/gulp-watch
[depstat-image]: https://david-dm.org/floatdrop/gulp-watch.png?theme=shields.io
