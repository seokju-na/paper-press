var gulp = require('gulp');

var imageop = require('gulp-image-optimization');
var ejs = require('gulp-ejs');
var less = require('gulp-less');
var concat = require('gulp-concat');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
var minifyCss = require('gulp-minify-css');

var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');



const paths = {
    src: './src',
    dist: './dist',
    entry: './src/main.js',
    styles: ['./src/styles/*.less', './src/styles/**/*.less'],
    images: ['./src/assets/imgs/*.png', './src/assets/imgs/*.jpg',
        './src/assets/imgs/*.jpeg', './src/assets/imgs/*.gif'],
    favicon: './src/assets/favicon/*.*',
    index: './src/templates/index.html'
};

var blogJSON = require('./src/blog.json');
delete blogJSON['posts'];

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

gulp.task('html', function(cb) {
    gulp.src(paths.index)
        .pipe(ejs({
            blog: blogJSON
        }))
        .pipe(gulp.dest(paths.dist))
        .on('end', cb)
        .on('error', function(err) {
            throw err;
        });
});


gulp.task('js', function() {
    return browserify('./src/main.js')
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

gulp.task('default', ['imgs', 'favicon', 'html', 'js', 'styles']);