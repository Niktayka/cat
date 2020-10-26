const gulp = require('gulp'),
      pug = require('gulp-pug'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cssMinify = require('gulp-csso'),
      uglify = require('gulp-uglify-es').default,
      clean = require('gulp-clean'),
      concat = require('gulp-concat'),
      copy = require('gulp-copy'),
      rename = require('gulp-rename');

gulp.task('scss', () => {
    gulp.src('./src/scss/main.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('pug', () => {
    gulp.src('./src/pug/main.pug')
        .pipe(pug({ pretty: false }))
        .pipe(rename((path) => {
            path.basename = 'index'
        }))
        .pipe(gulp.dest('./src/'));
});

gulp.task('concat:css', () => {
    gulp.src(['./src/css/normalize.css', './src/css/main.css'])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch', () => {
    gulp.watch(['./src/pug/*.pug', './src/scss/*.scss'], ['pug', 'scss']);
});

gulp.task('clean', () => {
    gulp.src('./docs')
        .pipe(clean({force: true}));
});

gulp.task('copy2docs', () => {
    gulp.src([
        './src/index.html',
        './src/css/styles.min.css',
        './src/js/script.min.js',
        './src/fonts/*.otf',
        './src/img/*.png'])
        .pipe(copy('./docs', { prefix: 1 }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('uglify-js', () => {
    gulp.src('./src/js/script.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('minify-css', () => {
    gulp.src('./src/css/styles.css')
        .pipe(cssMinify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./src/css'))
});

gulp.task('css', ['scss', 'concat:css']);

gulp.task('build', ['clean', 'pug', 'scss', 'concat:css', 'minify-css', 'uglify-js', 'copy2docs']);