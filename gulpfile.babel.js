// 'use strict';

const gulp    = require('gulp');
const babel   = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const notify  = require('gulp-notify');
const clean   = require('gulp-clean');

const srcFiles = ['app.js', 'src/**/*.js'];




gulp.task('es6', () => {
  return gulp
    .src(srcFiles, {base: '.'})
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('json', () => {
  return gulp
    .src(['src/config/*'], {base: '.'})
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('clean', function () {
  return gulp
    .src('dist/', {read: false})
    .pipe(clean())
  ;
});


gulp.task('server', function() {
  nodemon({
    script: 'dist/app.js',
    watch: ['app.js', 'src/**/*.js', 'config'],
    ext: 'js json',
    tasks: ['build']
  }).on('restart', function() {
    gulp.src('app.js').pipe(notify('Server successfully restarted'));
  })
});

gulp.task('default', ['build', 'server']);
gulp.task('build', ['es6', 'json']);
gulp.task('heroku', ['clean', 'build']);

////////////