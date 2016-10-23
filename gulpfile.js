'use strict';

const fs = require('fs');
const gulp = require('gulp');
const replace = require('gulp-replace');
const ghtmlSrc = require('gulp-html-src');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cssmin = require('gulp-minify-css');
const htmlreplace = require('gulp-html-replace');
const del = require('del');


gulp.task('clean', () => del(['dist/**/*']));


gulp.task('build-js', ['clean'], () => {
    let rv = gulp
        .src('src/index.html')
        .pipe(ghtmlSrc())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));

    return rv;
});


gulp.task('build-css', ['clean'], () => {
    let rv = gulp
        .src('src/index.html')
        .pipe(ghtmlSrc({presets: 'css'}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));

    return rv;
});


gulp.task('inject', ['build-js', 'build-css'], () => {
    let cssFile = 'dist/app.min.css';
    let jsFile = 'dist/app.min.js';

    return gulp.src('src/index.html')
        .pipe(htmlreplace({
            'css': `<style>${fs.readFileSync(cssFile, 'utf8')}</style>`,
            'js': `<script>${fs.readFileSync(jsFile, 'utf8')}</script>`
        }))
        .pipe(gulp.dest('./'));
});


/**
 * Default `gulp` methold.
 */
gulp.task('default', [
    'clean',
    'build-js',
    'build-css',
    'inject'
]);


gulp.task('watch', () => gulp.watch('src/**/*', ['default']));
