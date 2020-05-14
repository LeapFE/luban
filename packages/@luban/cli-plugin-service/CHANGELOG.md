# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.4](https://github.com/leapFE/luban/compare/v1.2.3...v1.2.4) (2020-05-14)


### Bug Fixes

* **service:** confused publicPath while ensuer slash option.publicPath ([a0c0a09](https://github.com/leapFE/luban/commit/a0c0a09218fea52cdab645e0a185b22692c4e7e9))





## [1.2.2](https://github.com/leapFE/luban/compare/v1.2.1...v1.2.2) (2020-05-06)


### Bug Fixes

* **service:** uncaught error during load specified config file ([b9e65b4](https://github.com/leapFE/luban/commit/b9e65b4aa5ff3c92471c2bb954ffba0a617b3f2c))





## [1.2.1](https://github.com/leapFE/luban/compare/v1.2.0...v1.2.1) (2020-05-06)


### Bug Fixes

* **service:** can't find entry file after run build and specify --entry ([7263ea0](https://github.com/leapFE/luban/commit/7263ea03ba58ff45c4fb94abb4d8bccf658d1e8e))


### Features

* **service:** support specify config file while run serve/build/inspect ([229918e](https://github.com/leapFE/luban/commit/229918eace7b3381712a54cf9c8434bc202469b7))
* **service:** support specify template path ([6123bd0](https://github.com/leapFE/luban/commit/6123bd0a7cec6f6ece7ce24e07c1fe89b3d16baa))





# [1.2.0](https://github.com/leapFE/luban/compare/v1.1.2...v1.2.0) (2020-04-29)


### Bug Fixes

* **service:** check projectConfig schema by joi ([58deaab](https://github.com/leapFE/luban/commit/58deaabc4dcbf3eae2d468809adbe9eb78d11bcd))


### Features

* **eslint,service:** support eslint config [leap] ([a1f2e01](https://github.com/leapFE/luban/commit/a1f2e0190f72364f3aa3d02fae96530457292d17))





## [1.1.2](https://github.com/leapFE/luban/compare/v1.1.1...v1.1.2) (2020-04-29)


### Bug Fixes

* **service:** generate correct scriptsDir while assetsDir.scripts empty ([6cd80d0](https://github.com/leapFE/luban/commit/6cd80d0b312074b4a6e7e52ba529af9463aefa6d))





## [1.1.1](https://github.com/leapFE/luban/compare/v1.1.0...v1.1.1) (2020-04-29)


### Bug Fixes

* **service:** set correctly publicPath for images while building ([a34c685](https://github.com/leapFE/luban/commit/a34c68525693f3007ac1aa2ea4834a330cac0a5c))


### Features

* **service:** support specify assetsDir, include scripts,styles,images ([d53b1d7](https://github.com/leapFE/luban/commit/d53b1d7b79a24aee5bb8e5677484b2699ecb416e))





# [1.1.0](https://github.com/leapFE/luban/compare/v1.0.5...v1.1.0) (2020-04-12)


### Features

* **service:** deprecated assets field in luban.config.js ([007bb6a](https://github.com/leapFE/luban/commit/007bb6abf64b7e7eb0b4491a35858830b0b60bc0))





## [1.0.5](https://github.com/leapFE/luban/compare/v1.0.4...v1.0.5) (2020-04-11)


### Features

* **service:** optimize css assets use optimizeCssAssetsWebpackPlugin ([16cddcb](https://github.com/leapFE/luban/commit/16cddcbc25697011ba575a1484af7d9176c5ec12))





## [1.0.4](https://github.com/leapFE/luban/compare/v1.0.3...v1.0.4) (2020-03-18)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [1.0.2](https://github.com/leapFE/luban/compare/v1.0.1...v1.0.2) (2020-03-18)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [1.0.1](https://github.com/leapFE/luban/compare/v1.0.0...v1.0.1) (2020-03-17)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





# [1.0.0](https://github.com/leapFE/luban/compare/v0.0.19...v1.0.0) (2020-03-17)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.19](https://github.com/leapFE/luban/compare/v0.0.18...v0.0.19) (2020-03-17)


### Features

* **fetch:** supported data fetching feature ([66977d0](https://github.com/leapFE/luban/commit/66977d0bfb48705faa55bbfabc190bd9c00a68be))





## [0.0.18](https://github.com/leapFE/luban/compare/v0.0.17...v0.0.18) (2020-03-16)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.17](https://github.com/leapFE/luban/compare/v0.0.16...v0.0.17) (2020-03-15)


### Bug Fixes

* **service:** fix 'error is not defined' while run bin/service ([72730df](https://github.com/leapFE/luban/commit/72730df641318836fbd8de224502eeb19f840862))





## [0.0.16](https://github.com/leapFE/luban/compare/v0.0.15...v0.0.16) (2020-03-15)


### Bug Fixes

* **service:** fix plugin service bin dir ignored by git ([4117b68](https://github.com/leapFE/luban/commit/4117b683d7d0690ea198943cdec750205cf7fbab))
* **service:** modify document address in template ([ada5ec0](https://github.com/leapFE/luban/commit/ada5ec0772e751488f27d2d065d33e3884d6bc35))


### Features

* **service,babel:** supported UI componnet library feature ([91a952f](https://github.com/leapFE/luban/commit/91a952fd289ccedc64a33321c7219da17cc29739))
* **service,babel,cli:** unsupported UI library feature select ([689a91c](https://github.com/leapFE/luban/commit/689a91c543653053708a3ed1ad20947a9740d777))





## [0.0.15](https://github.com/leapFE/luban/compare/v0.0.14...v0.0.15) (2020-02-27)


### Features

* **service,router,store:** supported feature of store ([fe59d86](https://github.com/leapFE/luban/commit/fe59d86efb15a9ec0402811a489fef43b0ef29d2))





## [0.0.14](https://github.com/leapFE/luban/compare/v0.0.13...v0.0.14) (2020-02-27)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.13](https://github.com/leapFE/luban/compare/v0.0.12...v0.0.13) (2020-02-27)


### Bug Fixes

* **service:** fix bug of object destructuring while assign projectConfig ([b2d06c7](https://github.com/leapFE/luban/commit/b2d06c71a24e50bd6e277e98bdc9bed377908bd2))





## [0.0.12](https://github.com/leapFE/luban/compare/v0.0.11...v0.0.12) (2020-02-25)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.11](https://github.com/leapFE/luban/compare/v0.0.10...v0.0.11) (2020-02-25)


### Bug Fixes

* **router,service,utils:** fix some bugs ([4d20904](https://github.com/leapFE/luban/commit/4d209046513689f1ed2f92d5e04b71f6a8eb8e17))





## [0.0.10](https://github.com/leapFE/luban/compare/v0.0.9...v0.0.10) (2020-02-25)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.9](https://github.com/leapFE/luban/compare/v0.0.8...v0.0.9) (2020-02-25)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.8](https://github.com/leapFE/luban/compare/v0.0.7...v0.0.8) (2020-02-25)


### Bug Fixes

* **service:** add file content to dotenv file ([b30366f](https://github.com/leapFE/luban/commit/b30366fa88d80dc2683285e3a6f0ac7f7d2cc446))
* **service:** fix and add luban-cli-service command and set correct env ([2d990e0](https://github.com/leapFE/luban/commit/2d990e02f21c096db4af557801618f947581b3b6))
* **service:** fix webpack config about stylesheet file(less,css) ([cea1556](https://github.com/leapFE/luban/commit/cea1556e09ee277b12c3794c8545d5cff7d5064a))
* **service:** lack suitable loader(babel-loader) to handle js code ([a245cfc](https://github.com/leapFE/luban/commit/a245cfc88d4d37922c3d0f859562456a6d5e1cd8))


### Features

* **cli,plugin-service:** warn when cli,plugin-service resolve plugin ([b2b9fdb](https://github.com/leapFE/luban/commit/b2b9fdbcfd86904beecd9abdb5401c36cc365a04))
* **cli,service:** move dir assets to src in service template ([2de26cd](https://github.com/leapFE/luban/commit/2de26cd6fe8fccb30a3328adade93e330a625766))





## [0.0.7](https://github.com/leapFE/luban/compare/v0.0.6...v0.0.7) (2020-02-22)


### Bug Fixes

* fix plugin service and shared utils dependencies ([055c88f](https://github.com/leapFE/luban/commit/055c88f39cd0e20f2839bc4b6940635a6cfd1dd3))





## [0.0.6](https://github.com/leapFE/luban/compare/v0.0.5...v0.0.6) (2020-02-22)


### Bug Fixes

* can't find plugin's generator while create project ([26d78cb](https://github.com/leapFE/luban/commit/26d78cb4405794c1fdc2527460f99c04c6f5b769))





## [0.0.5](https://github.com/leapFE/luban/compare/v0.0.4...v0.0.5) (2020-02-22)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.4](https://github.com/leapFE/luban/compare/v0.0.3...v0.0.4) (2020-02-21)

**Note:** Version bump only for package @luban-cli/cli-plugin-service





## [0.0.3](https://github.com/leapFE/luban/compare/v0.0.2...v0.0.3) (2020-02-21)


### Bug Fixes

* **all:** fix some bugs ([7afcf92](https://github.com/leapFE/luban/commit/7afcf92b036d48130bdf271542e5e632068d0a6d))





## 0.0.2 (2020-02-18)


### Features

* **all:** :rocket: init project ([61147c6](https://github.com/leapFE/luban/commit/61147c64b1e2bb608b73e921910077692a71df49))
