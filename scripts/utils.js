"use strict";

const shell = require("shelljs");

module.exports = {
  /**
   * @returns {string[]}
   */
  getChangedPackages() {
    const { stdout } = shell.exec(
      "git diff HEAD --stat --compact-summary -- ./packages/**/**/src/**",
    );
    const changedFiles = stdout.split("\n");

    const changePackagesList = new Set();

    changedFiles.forEach((fileName) => {
      if (/(cli|cli-plugin-)/.test(fileName)) {
        const matchedResult = fileName.match(/\/cli-?(\w|-){0,20}\//);
        if (Array.isArray(matchedResult)) {
          const matchedPackageName = matchedResult[0];
          changePackagesList.add(matchedPackageName.replace(/\//g, ""));
        }
      }
    });

    return Array.from(changePackagesList);
  },

  /**
   *
   * @see https://github.com/cowboy/node-exit
   * @param {number} exitCode
   * @param {*} streams
   */
  exit(exitCode, streams) {
    if (!streams) {
      streams = [process.stdout, process.stderr];
    }

    var drainCount = 0;

    function tryToExit() {
      if (drainCount === streams.length) {
        process.exit(exitCode);
      }
    }

    streams.forEach(function(stream) {
      // Count drained streams now, but monitor non-drained streams.
      if (stream.bufferSize === 0) {
        drainCount++;
      } else {
        stream.write("", "utf-8", function() {
          drainCount++;
          tryToExit();
        });
      }
      stream.write = function() {};
    });

    tryToExit();

    process.on("exit", function() {
      process.exit(exitCode);
    });
  },
};
