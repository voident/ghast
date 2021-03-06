'use strict';

var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var watch  = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var sassLint = require('gulp-sass-lint');
var del = require('del');

gulp.task('clean', function() {
  return del(['css']);
});

gulp.task('lint', function () {
  gulp.src(['./src/base/*.s+(a|c)ss', './src/components/*.s+(a|c)ss'])
    .pipe(sassLint({
      configFile: '.sass-lint.yaml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('sourcemap', function () {
  gulp.src('./src/**/*.sass')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe (rename({
      extname: ".css.map"
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass', function () {
  gulp.src('./src/ghast.sass')
    .pipe(sass({
      includePaths: ['./src/base', './src/components', './src/utilities'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename({
        extname: ".min.css"
      }))
    .pipe(gulp.dest('./css'))
});

gulp.task('watch', ['build'], function() {
    gulp.watch(['src/*/*.sass', 'src/**/*.sass'], ['default']);
});

gulp.task('build', ['clean', 'sass', 'sourcemap'], function() {
  gulp.src('./src/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
});

gulp.task('default', ['build']);
