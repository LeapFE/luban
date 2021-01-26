/* eslint-disable no-invalid-this */
const gulp = require("gulp");
const through2 = require("through2");
const ts = require("gulp-typescript");
const rimraf = require("rimraf");
const babel = require("gulp-babel");
const merge2 = require("merge2");
const webpack = require("webpack");
// const argv = require("minimist")(process.argv.slice(2));

const { getProjectPath, replaceLib } = require("./share");
const tsConfig = require("./getTSCommonConfig");
const transformLess = require("./transformLess");
const getBabelCommonConfig = require("./getBabelCommonConfig");
const getWebpackConfig = require("./getWebpackConfig");

const libDir = getProjectPath("lib");
const esDir = getProjectPath("es");

function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, ".css");
}

function dist(done) {
  rimraf.sync(getProjectPath("dist"));
  process.env.NODE_ENV = "PRODUCTION";

  const webpackConfig = getWebpackConfig();

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);

    done(0);
  });
}

function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules);
  delete babelConfig.cacheDirectory;
  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  }
  const stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
        const content = file.contents.toString(encoding);
        if (content.indexOf("'react-native'") !== -1) {
          // actually in antd-mobile@2.0, this case will never run,
          // since we both split style/index.mative.js style/index.js
          // but let us keep this check at here
          // in case some of our developer made a file name mistake ==
          next();
          return;
        }

        file.contents = Buffer.from(cssInjection(content));
        file.path = file.path.replace(/index\.js/, "css.js");
        this.push(file);
        next();
      } else {
        next();
      }
    }),
  );

  return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}

/**
 *
 * @param {boolean} modules is commonjs module style;
 */
function compile(modules) {
  rimraf.sync(modules !== false ? libDir : esDir);

  const less = gulp
    .src(["components/**/*.less"])
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.less$/)) {
          transformLess(file.path)
            .then((css) => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, ".css");
              this.push(file);
              next();
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          next();
        }
      }),
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  const assets = gulp
    .src(["components/**/*.@(png|svg)"])
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  const source = [
    "components/**/*.tsx",
    "components/**/*.ts",
    "typings/**/*.d.ts",
    "!components/**/__tests__/**",
  ];

  const compilerOptions = tsConfig(modules);

  if (compilerOptions.allowJs) {
    source.unshift("components/**/*.jsx");
  }

  const tsResult = gulp.src(source).pipe(ts(compilerOptions));

  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));

  return merge2([less, tsFilesStream, tsd, assets]);
}

gulp.task("dist", (done) => {
  console.log("Building UMD...");
  dist(done);
});

gulp.task("compile-with-es", (done) => {
  console.log("[Parallel] Compile to es...");
  compile(false).on("finish", done);
});

gulp.task("compile-with-lib", (done) => {
  console.log("[Parallel] Compile to js...");
  compile().on("finish", done);
});

gulp.task("build", gulp.series(gulp.parallel("compile-with-es", "compile-with-lib"), "dist"));
