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
import header from 'gulp-header'
import jade from 'gulp-jade'
import sass from 'gulp-sass'
import rename from 'gulp-rename'
import size from 'gulp-size'
import cache from 'gulp-cache'
import imagemin from 'gulp-imagemin'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import gutil from 'gulp-util'
import csso from 'gulp-csso'
import karma from 'karma'
import protractor from 'gulp-protractor'
import bs from 'browser-sync'
import spa from 'connect-history-api-fallback'
import modRewrite from 'connect-modrewrite'
import del from 'del'
import path from 'path'
import _ from 'lodash'

const browserSync = bs.create()
const handleError = function (err) {
  gutil.log(err)
  this.emit('end')
}

const compile = function (watch=false) {
  var bundler = browserify('./src/app/index.js', {debug: true}) // change to false in prod
    .transform(babelify)
    .transform(annotate)
    //.transform({global: true}, uglifyify)

  const rebundle = () => {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(transform(() => exorcist('./dist/bundle.js.map')))
      .pipe(gulp.dest('./dist'))
      .pipe(size({title: 'bundle.js'}))
      .pipe(browserSync.stream({once: true}))
  }
  if (watch) {
    bundler = watchify(bundler)
    bundler.on('update', () => {
      gutil.log('-> bundling...')
      rebundle()
    })
  }
  return rebundle()
}

gulp.task('browserify', ['templatecache'], () => compile())
gulp.task('watchify', ['templatecache'], () => compile(true))

gulp.task('templatecache', ['jade'], () => {
  return gulp.src('./.tmp/templates/**/*.html')
    .pipe(templateCache('index.js', {standalone: true, module: 'dweb.templates'}))
    .pipe(header('"use strict"\nimport angular from "angular"\nexport default "dweb.templates"\n'))
    .pipe(gulp.dest('./src/app/templates'))
})

gulp.task('jade', () => {
  gulp.src('./src/index.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./dist'))
  return gulp.src(['./src/app/**/*.jade'])
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./.tmp/templates/app'))
    .pipe(size({title: 'templates'}))
})

gulp.task('watch', ['watchify', 'templatecache', 'sass', 'assets'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
      middleware: [modRewrite(['^/api/(.*)$ http://jsonplaceholder.typicode.com/$1 [P]']), spa()]
    },
    logPrefix: 'WATCH',
    open: true
  })
  gulp.watch('src/**/*.jade', ['templatecache'])
  gulp.watch(['src/app/**/*.{sass,scss}', 'src/sass/**/*.{sass,scss}'], ['sass'])
})

gulp.task('sass', () => {
  return gulp.src('src/sass/index.sass')
    //.pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./bower_components']
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 1 version'))
    //.pipe(csso())
    .pipe(rename('bundle.css'))
    //.pipe(sourcemaps.write('.'))
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
  return gulp.src(['src/app/*.{txt,ico,json,webapp}'])
    .pipe(gulp.dest('./dist'))
    .pipe(size({title: 'other assets'}))
})

gulp.task('assets', ['fonts', 'images', 'copy'])

const karmaTest = (done, watch=false) => {
  new karma.Server({
    configFile: path.join(__dirname + '/src/test/karma.conf.js'),
    singleRun: !watch
  }, done).start()
}

gulp.task('test:single-run', (done) => {
  karmaTest(done)
})

gulp.task('test:watch', (done) => {
  karmaTest(done, true)
})

gulp.task('test:e2e:update-webdriver', protractor.webdriver_update)

gulp.task('test:e2e', ['test:e2e:update-webdriver'], (done) => {
  const runProtractor = (err, bs) => {
    const baseUrl = `http://localhost:${bs.options.get('port')}`
    gulp.src([], {read: false})
      .pipe(protractor.protractor({
        configFile: 'src/test/protractor.conf.js',
        args: ['--baseUrl', baseUrl]
      }))
      .on('error', handleError)
      .on('end', function () {
        done()
        browserSync.exit()
      })
  }
  browserSync.init({
    server: {
      baseDir: './dist',
      middleware: [modRewrite(['^/api/(.*)$ http://jsonplaceholder.typicode.com/$1 [P]']), spa()]
    },
    open: false,
    ui: false,
    logPrefix: 'E2E'
  }, runProtractor)
})
gulp.task('build', ['images', 'sass', 'jade', 'browserify', 'assets'])
