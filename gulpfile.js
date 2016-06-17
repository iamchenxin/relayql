/*eslint-env node */
var gulp=require('gulp');
var babel=require('gulp-babel');
var sourcemaps=require('gulp-sourcemaps');
//var rename = require('gulp-rename');
var path=require('path');
var gutil =require('gulp-util');
const fbjsConfigure = require('babel-preset-fbjs/configure');


gulp.task('server', function() {
  return stdGulpTrans('src/server', 'dst/server');
});

gulp.task('common', function() {
  return stdGulpTrans('src/common', 'dst/common');
});

gulp.task('all', ['common', 'server'], function() {
  gutil.log('all...............');

});



gulp.task('clean-src', function() {
  rmdir(['src/client/app']);
});

// ........functions .......
var fs = require('fs');
function rmdir(pathNames) {
  pathNames.forEach(function(pathName) {
    var stat = fs.statSync(pathName);
    if ( stat.isFile()) {
      rmfile(pathName);
      console.log('delete file : ' + pathName);
    }
    if (stat.isDirectory()) {
      var subPaths = fs.readdirSync(pathName)
        .map(function(subPathName) {
          return path.resolve(pathName, subPathName);
        });
      rmdir(subPaths);
      fs.rmdirSync(pathName);
      console.log('delete DIR : ' + pathName);
    }
  });

  function rmfile(name) {
    fs.unlinkSync(name);
  }
}

function stdGulpTrans(src, dst) {
  var sourceRoot = path.join(__dirname, src);
  var srcPath = [src+'/**/*.js',
    '!'+src+'/**/__tests__/**', '!'+src+'/**/__mocks__/**'];
  return gulp
    .src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [
        fbjsConfigure({
          autoImport: false,
          target: 'js',
        }),
      ],
    }))
    .pipe(sourcemaps.write('.', {
      includeContent: true, sourceRoot: sourceRoot, debug:true
    }))
    .pipe(gulp.dest(dst));
}
