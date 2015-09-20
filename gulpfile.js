const gulp = require('gulp')
    , sass = require('gulp-ruby-sass')
    , autoprefixer = require('gulp-autoprefixer')
    , minifycss = require('gulp-minify-css')
    , jshint = require('gulp-jshint')
    , uglify = require('gulp-uglify')
    , imagemin = require('gulp-imagemin')
    , rename = require('gulp-rename')
    , concat = require('gulp-concat')
    , notify = require('gulp-notify')
    , cache = require('gulp-cache')
    , livereload = require('gulp-livereload')
    , del = require('del')
    , bower = require('gulp-bower')
    ;

const config = {
    sassPath: './src/styles',
    bowerDir: './bower_components',
    bootstrapDir: './bower_components/bootstrap-sass',
    jqueryDir: './bower_components/jquery'
};

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('styles', function () {
    return sass(
        config.sassPath + '/main.scss',
        {
            style: 'expanded',
            loadPath: [
                config.sassPath,
                config.bootstrapDir + '/assets/stylesheets'
            ]
        }
    )
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function () {
    return gulp.src(
        [
            config.jqueryDir + '/dist/jquery.js',
            config.bootstrapDir + '/assets/javascripts/bootstrap.js',
            'src/scripts/**/*.js'
        ])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('public/img'))
        .pipe(notify({message: 'Images task complete'}));
});

gulp.task('fonts', function () {
    return gulp.src(
        [
            config.bootstrapDir + '/assets/fonts/**/*',
            'src/fonts/**/*',
        ])
        .pipe(gulp.dest('public/fonts'))
        .pipe(notify({message: 'Fonts task complete'}));
});

gulp.task('clean', function (cb) {
    del(['public/css', 'public/js', 'public/img', 'public/fonts'], cb);
});

gulp.task('default', [], function () {
    gulp.start('styles', 'scripts', 'images', 'fonts');
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch fonts files
    gulp.watch('src/fonts/**/*', ['fonts']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['public/**']).on('change', livereload.changed);

});
