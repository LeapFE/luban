/* eslint-disable @typescript-eslint/no-explicit-any */
import Gulp from "gulp";
import through2 from "through2";
import ts from "gulp-typescript";
import rimraf from "rimraf";
import babel from "gulp-babel";
import merge2 from "merge2";
import webpack from "webpack";
import { Readable } from "stream";

import { getProjectPath, replaceLib } from "./share";
import { getTsConfig } from "./getTSCommonConfig";
import { compileLess } from "./compileLess";
import { getBabelConfig } from "./getBabelConfig";
import { getWebpackConfig } from "./getWebpackConfig";

const SOURCE_DIR = "components";
const libDir = getProjectPath("lib");
const esDir = getProjectPath("es");

function cssInjection(content: string) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, ".css");
}

function dist(done: Gulp.TaskFunctionCallback) {
  rimraf.sync(getProjectPath("dist"));
  process.env.NODE_ENV = "PRODUCTION";

  const webpackConfig = getWebpackConfig();

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);

      if ((err as any).details) {
        console.error((err as any).details);
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

    done(null);
  });
}

function babelify(js: Readable, isCommonJsModule: boolean) {
  const babelConfig = getBabelConfig(isCommonJsModule);

  if (isCommonJsModule === false && babelConfig.plugins) {
    babelConfig.plugins.push(replaceLib);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
        const content = file.contents.toString(encoding);

        file.contents = Buffer.from(cssInjection(content));
        file.path = file.path.replace(/index\.js/, "css.js");

        this.push(file);

        next();
      } else {
        next();
      }
    }),
  );

  return stream.pipe(Gulp.dest(isCommonJsModule === false ? esDir : libDir));
}

/**
 *
 * @param {boolean} modules is commonjs module style;
 */
function compile(isCommonJsModule: boolean) {
  rimraf.sync(isCommonJsModule !== false ? libDir : esDir);

  const less = Gulp.src([`${SOURCE_DIR}/**/*.less`])
    .pipe(
      through2.obj(function(file, _encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.less$/)) {
          compileLess(file.path)
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
    .pipe(Gulp.dest(isCommonJsModule === false ? esDir : libDir));

  const assets = Gulp.src([`${SOURCE_DIR}/**/*.@(png|svg)`]).pipe(
    Gulp.dest(isCommonJsModule === false ? esDir : libDir),
  );

  const source = [
    `${SOURCE_DIR}/**/*.tsx`,
    `${SOURCE_DIR}/**/*.ts`,
    "typings/**/*.d.ts",
    `!${SOURCE_DIR}/**/__tests__/**`,
  ];

  const compilerOptions = getTsConfig(isCommonJsModule);

  if (compilerOptions.allowJs) {
    source.unshift(`${SOURCE_DIR}/**/*.jsx`);
  }

  const tsResult = Gulp.src(source).pipe(ts(compilerOptions));

  const tsFilesStream = babelify(tsResult.js, isCommonJsModule);
  const tsd = tsResult.dts.pipe(Gulp.dest(isCommonJsModule === false ? esDir : libDir));

  return merge2([less, tsFilesStream, tsd, assets]);
}

Gulp.task("dist", (done) => {
  console.log("Building UMD...");
  dist(done);
});

Gulp.task("compile-with-es", (done) => {
  console.log("[Parallel] Compile to es...");
  compile(false).on("finish", done);
});

Gulp.task("compile-with-lib", (done) => {
  console.log("[Parallel] Compile to js...");
  compile(true).on("finish", done);
});

Gulp.task("build", Gulp.series(Gulp.parallel("compile-with-es", "compile-with-lib"), "dist"));

export function build() {
  Gulp.task("build")(() => null);
}
