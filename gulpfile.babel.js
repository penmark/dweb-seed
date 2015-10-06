'use strict'
import gulp from 'gulp'
import browserify from 'browserify'
import babelify from 'babelify'
import watchify from 'watchify'
import uglify from 'gulp-uglify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
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
import minifyCss from 'gulp-minify-css'
import minifyHtml from 'gulp-minify-html'
import rev from 'gulp-rev'
import revReplace from 'gulp-rev-replace'
import gulpIf from 'gulp-if'
import karma from 'karma'
import protractor from 'gulp-protractor'
import runSequence from 'run-sequence'
import bs from 'browser-sync'
import spa from 'connect-history-api-fallback'
import modRewrite from 'connect-modrewrite'
import del from 'del'
import path from 'path'
import _ from 'lodash'

const browserSync = bs.create()
const serverConfig = {
  baseDir: './dist',
  middleware: [modRewrite(['^/api/(.*)$ http://jsonplaceholder.typicode.com/$1 [P]']), spa()]
}
const handleError = function (err) {
  gutil.log(err)
  this.emit('end')
}

let prod = false

const compile = function (watch=false) {
  var bundler = browserify('./src/app/index.js', {debug: !prod})
    .transform(babelify)
    .transform(annotate)

  const rebundle = () => {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(gulpIf(prod, uglify()))
      .pipe(sourcemaps.write('./'))
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
    .pipe(gulpIf(prod, minifyHtml()))
    .pipe(gulp.dest('./dist'))
  return gulp.src(['./src/app/**/*.jade'])
    .pipe(jade({pretty: true}))
    .pipe(gulpIf(prod, minifyHtml()))
    .pipe(gulp.dest('./.tmp/templates/app'))
    .pipe(size({title: 'templates'}))
})

gulp.task('watch', ['watchify', 'templatecache', 'sass', 'assets'], () => {
  browserSync.init({
    server: serverConfig,
    logPrefix: 'WATCH',
    open: true
  })
  gulp.watch('src/**/*.jade', ['templatecache'])
  gulp.watch(['src/app/**/*.{sass,scss}', 'src/sass/**/*.{sass,scss}'], ['sass'])
})

gulp.task('serve:dist', ['dist'], () => {
  browserSync.init({
    server: serverConfig,
    logPrefix: 'DIST',
    open: true
  })
})

gulp.task('sass', () => {
  return gulp.src('src/sass/index.sass')
    // Sourcemaps doesn't function well with minification
    .pipe(gulpIf(!prod, sourcemaps.init()))
    .pipe(sass({
      includePaths: ['./bower_components'],
      sourceComments: !prod,
      outputStyle: 'compact'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gulpIf(prod, minifyCss()))
    .pipe(rename('bundle.css'))
    .pipe(gulpIf(!prod, sourcemaps.write('./')))
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

gulp.task('clean', (done) => {
  del(['./dist'], done)
})

gulp.task('fonts', () => {
  return gulp.src([
      'src/assets/fonts/**/*', 'bower_components/font-awesome/fonts/*',
      'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'
    ])
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
    server: serverConfig,
    open: false,
    ui: false,
    logPrefix: 'E2E'
  }, runProtractor)
})

gulp.task('build', ['assets', 'sass', 'templatecache', 'browserify'])

gulp.task('rev', ['browserify', 'sass'], () => {
  const sources = ['./dist/bundle.js', './dist/bundle.css']
  return gulp.src(sources)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))
    //.pipe(del(sources))
})

gulp.task('rev-replace', ['rev'], () => {
  return gulp.src('./dist/index.html')
    .pipe(revReplace({
      manifest: gulp.src('./dist/rev-manifest.json')
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('mark-dist', (done) => {
  prod = true
  gutil.log(gutil.colors.cyan.bold('Building minified distribution'))
  done()
})

gulp.task('dist', ['mark-dist', 'assets', 'rev-replace'])
