

// const gulp = require('gulp');
// const rollup = require('gulp-rollup');
// const include = require('gulp-include');
// var sourcemaps = require('gulp-sourcemaps');


import gulp from "gulp";
import rollup from "gulp-rollup";
import fs from "fs";
// import include from "gulp-include";

import insert from "gulp-insert";
// import uglify from "gulp-uglify";


// dont works! TODO: make issue
// import sourcemaps from "gulp-sourcemaps";



// const config = require('./rollup.config')

import config from "./rollup.config.js";

// console.log(config);
// console.log(insert);


console.warn('The gulp start is deprecated now');
console.warn('The gulp start is deprecated now');
console.warn('The gulp start is deprecated now');
console.warn('The gulp start is deprecated now');
console.warn('The gulp start is deprecated now');
console.warn('The gulp start is deprecated now');




gulp.task('prepare', function (done) {
    gulp.src('./js/typescriptServices.js')
        .pipe(uglify())
        .pipe(gulp.dest('./js/min'))
        .on('finish', function () {
            done()
        })
})


gulp.task('build', function (done) {

    gulp.src('./scripts/**/*.*s')
        // transform the files here.
        // .pipe(include({ hardFail: true})).on('error', console.log)            
        .pipe(insert.transform(function (contents, file) {
            // console.log(file);
            contents = contents.replace('define(function(require, exports, module) {', '');            
            contents = contents.replace('});', function (match, group, index, content) {
                // console.log(match);
                // console.log(index);
                // console.log(group);
                return ''
            });
            return contents
        })).on('finish', () => {
            console.log('files prepared...');
        })
        .pipe(rollup({
            // any option supported by Rollup can be set here.
            //?
            ...config[1],
            // allowRealFiles: true,
        })).on('error', function () {
            console.log(arguments);
        })        

        .pipe(gulp.dest('./build')).on('finish', function () {
            done()
        });
})


if (!~process.argv.indexOf('build')) {
    // for debugging only:
    gulp.task('build')()
}