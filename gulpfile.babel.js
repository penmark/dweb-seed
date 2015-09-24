'use strict'
import gulp from 'gulp'
import browserify from 'browserify'
import babelify from 'babelify'
import watchify from 'watchify'
import uglifyify from 'uglifyify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import transform from 'vinyl-transform'
import exorcist from 'exorcist'
import annotate from 'browserify-ngannotate'
import templateCache from 'gulp-angular-templatecache'
import jade from 'gulp-jade'
import sass from 'gulp-sass'
import rename from 'gulp-rename'
import size from 'gulp-size'
import cache from 'gulp-cache'
import imagemin from 'gulp-imagemin'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import csso from 'gulp-csso'
import bs from 'browser-sync'
import del from 'del'

const browserSync = bs.create()

function compile(watch=false) {
  var bundler = browserify('./src/app/app.js', {debug: true}) // change to false in prod
    .transform(babelify)
    .transform(annotate)
    .transform(uglifyify)

  if (watch) {
    bundler = watchify(bundler)
    bundler.on('update', function() {
      console.log('-> bundling...')
      rebundle()
    })
  }

  function rebundle() {
    return bundler.bundle()
      .on('error', function (err) { console.error(err); this.emit('end') })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(transform(() => exorcist('./dist/bundle.js.map')))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream({once: true}))
  }
  return rebundle()
}

gulp.task('browserify', () => compile())
gulp.task('watchify', () => compile(true))

gulp.task('jade', () => {
  return gulp.src(['./src/**/*.jade'])
    .pipe(jade({pretty: true}))
    // minify
    .pipe(gulp.dest('./dist'))
    .pipe(size({title: 'templates'}))
    .pipe(browserSync.stream({once: true}))
})

gulp.task('watch', ['watchify', 'jade', 'sass', 'assets'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  gulp.watch('src/**/*.jade', ['jade'])
  gulp.watch(['src/app/**/*.{sass,scss,css}'], ['sass'])
})

gulp.task('sass', () => {
  return gulp.src('src/app/index.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(rename('bundle.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(size({title: 'stylesheet'}))
    .pipe(browserSync.stream({match: '**/*.css'}))
})

gulp.task('images', () => {
  return gulp.src('src/assets/img/**/*')
    .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      })))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(size({title: 'images'}))
})

gulp.task('clean', () => {
  return del(['./dist'])
})

gulp.task('fonts', () => {
  return gulp.src(['src/assets/fonts/**/*', 'node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('./dist/assets/fonts'))
    .pipe(size({title: 'fonts'}))
})

gulp.task('copy', () => {
  return gulp.src(['src/app/*', '!src/app/app.js', '!src/app/index.sass'])
    .pipe(gulp.dest('./dist'))
    .pipe(size({title: 'other assets'}))
})

gulp.task('assets', ['fonts', 'images', 'copy'])

gulp.task('build', ['images', 'sass', 'jade', 'browserify', 'assets'])
