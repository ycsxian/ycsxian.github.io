/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-clean-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-htmlmin gulp-replace gulp-livereload tiny-lr gulp-px2rem gulp-useref gulp-rev-append --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩
    sass = require('gulp-ruby-sass'), //sass
    cleanCSS = require('gulp-clean-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    stylish = require('jshint-stylish'),//jshint报告
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    htmlmin = require('gulp-htmlmin'), //html压缩
    replace = require('gulp-replace'),//替换变量
    px2rem = require('gulp-px2rem'),//像素转rem
    useref = require('gulp-useref'),
    rev = require('gulp-rev-append'),//引用资源增加时间戳
    //livereload
    livereload = require('gulp-livereload'), //服务器控制客户端同步刷新（需配合chrome插件LiveReload及tiny-lr）
    gulpif = require('gulp-if');

var dateNow = new Date().getTime();

var htmlSrc = './src/*.html',
    htmlDst = './dest/',
    cssSrc = './src/css/*.css',
    cssDst = './dest/css/',
    imgSrc = './src/images/*',
    imgDst = './dest/images/',
    jsSrc = './src/js/*.js',
    jsDst = './dest/js/',
    optionsSrc = './src/options/*',
    optionsDst = './dest/options/';
     

    
//非后台的营销页面修改为后台页面，但不修改原始链接，此时为true，其余都为false
var isFormalFiles = false;

var paths = ['css/common.css', 'js/head.js', 'js/main-app', 'js/main-online.js', 'js/underscore-min.js'];

var remotepath = '//pages.c-ctrip.com/commerce/promote/common/tpl3.0/dest/';

// HTML处理
gulp.task('html', function() {
    gulp.src(htmlSrc)
        .pipe(gulpif(isFormalFiles,replace(paths[0], remotepath + paths[0] + '?' + dateNow), replace(paths[0], paths[0] + '?' + dateNow)))
        .pipe(gulpif(isFormalFiles,replace(paths[1], remotepath + paths[1] + '?' + dateNow), replace(paths[1], paths[1] + '?' + dateNow)))
        .pipe(gulpif(isFormalFiles,replace(paths[2], remotepath + paths[2])))
        .pipe(gulpif(isFormalFiles,replace(paths[3], remotepath + paths[3] + '?' + dateNow), replace(paths[3], paths[3] + '?' + dateNow)))
        .pipe(gulpif(isFormalFiles,replace(paths[4], remotepath + paths[4] + '?' + dateNow), replace(paths[4], paths[4] + '?' + dateNow)))
        // .pipe(livereload(server))
        .pipe(replace('__VERSION', dateNow))
//        .pipe(rev())
        // .pipe(htmlmin({
        //     collapseWhitespace: true,
        //     collapseInlineTagWhitespace: true,
        //     minifyJS: true
        // }))
        .pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function() {

    gulp.src(cssSrc)
//    和css在同一路径下面，绝对路径、相对路径都可以。这里不做转换
//        .pipe(gulpif(isFormalFiles, replace('../images/ico-soldout-online.png', '//pages.ctrip.com/commerce/promote/common/tpl-release/dest/images/ico-soldout-online.png')))
//        .pipe(gulpif(isFormalFiles, replace('../images/sprite-online.png', '//pages.ctrip.com/commerce/promote/common/tpl-release/dest/images/sprite-online.png')))
//        .pipe(gulpif(isFormalFiles, replace('../images/title.png', '//pages.ctrip.com/commerce/promote/common/tpl-release/dest/images/title.png')))
//        .pipe(gulpif(isFormalFiles, replace('../images/title-online.png', '//pages.ctrip.com/commerce/promote/common/tpl-release/dest/images/title-online.png')))

        // .pipe(sass({ style: 'expanded'}))
        // .pipe(gulp.dest(cssDst))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        // 因为考虑到app、online样式不同，故注释此段代码
        // .pipe(px2rem({
        //     rootValue: 100,
        //     replace:true,
        //     mediaQuery:false,
        //     propertyBlackList:[]
        // }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        // .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function() {

    gulp.src(imgSrc)
        .pipe(imagemin())
        // .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
});

// js处理
gulp.task('js', function() {

    gulp.src(jsSrc)
        // .pipe(jshint())
        // .pipe(jshint.reporter(stylish))
        // .pipe(concat('main.js'))
        // .pipe(rename({
        //     suffix: '.src'
        // }))
        // .pipe(gulp.dest(jsDst))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(uglify({
            mangle:false
        }))
        // .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));

});

// js处理
gulp.task('copy-options', function() {


    gulp.src(optionsSrc)
        .pipe(gulp.dest(optionsDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dest'], {
            read: false
        })
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'images', 'js', 'copy-options', 'html');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {

        // 监听html
        gulp.watch(htmlSrc, function(event) {
            gulp.start('html');
        });

        // 监听css
        gulp.watch(cssSrc, function() {
            gulp.start('css','html');
        });

        // 监听images
        gulp.watch(imgSrc, function() {
            gulp.start('images');
        });

        // 监听js
        gulp.watch(jsSrc, function() {
            gulp.start('js','html');
        });

});