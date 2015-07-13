/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
    return sass('sass/app.scss', { style: 'expanded' })
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
        }))
        .pipe(gulp.dest('css'))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(livereload());
});

// Scripts


// Images


// Clean


// Default task
//gulp.task('default', function() {
  //  gulp.start('styles');
// });


// Watch
gulp.task('watch', function() {

    // Watch .scss files
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['styles']);

    // Watch .js files
    // gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    // gulp.watch('src/images/**/*', ['images']);

    // Create LiveReload server


    // Watch any files in dist/, reload on change
    // gulp.watch(['**/*.html', 'css/*.css']).on('change', livereload.changed);
    gulp.watch('**/*.html').on('change', livereload.changed);

});

gulp.task('default', ['styles', 'watch']);