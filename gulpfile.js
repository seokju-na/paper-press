var gulp = require('gulp');

var imageop = require('gulp-image-optimization');
var less = require('gulp-less');
var concat = require('gulp-concat');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix = new LessPluginAutoPrefix({});
var minifyCss = require('gulp-minify-css');

var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


const blogJSON = require('./src/blog.config.json');
const templateConfigJSON = require('./src/templates/' +
    blogJSON['template'] + '/pp.config.json');

const paths = {
    src: './src',
    dist: './dist',
    images: ['./src/assets/imgs/*.png', './src/assets/imgs/*.jpg',
        './src/assets/imgs/*.jpeg', './src/assets/imgs/*.gif'],
    favicon: './src/assets/favicon/*.*',
    js: './src/templates/' +
        templateConfigJSON['name'] + '/' +
        templateConfigJSON['build-path']['entry-js'],
    styles: './src/templates/' +
        templateConfigJSON['name'] + '/' +
        templateConfigJSON['build-path']['entry-styles'],
    libs: './src/templates/' +
        templateConfigJSON['name'] + '/' +
        templateConfigJSON['build-path']['libs']
};


gulp.task('imgs', function(cb) {
    gulp.src(paths.images)
        .pipe(imageop({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.dist))
        .on('end', cb)
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('favicon', function(cb) {
    gulp.src(paths.favicon)
        .pipe(gulp.dest(paths.dist + '/favicon'))
        .on('end', cb)
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('js', function() {
    return browserify(paths.js)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});


gulp.task('styles', function(cb) {
    gulp.src(paths.styles)
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dist))
        .on('end', cb)
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('libs', function(cb) {
    gulp.src(paths.libs)
        .pipe(gulp.dest(paths.dist))
        .on('end', cb)
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('default', ['imgs', 'favicon', 'js', 'styles', 'libs']);