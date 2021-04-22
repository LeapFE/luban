# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-next.21](https://github.com/LeapFE/luban/compare/v2.0.0-next.20...v2.0.0-next.21) (2021-04-22)

**Note:** Version bump only for package luban





# [2.0.0-next.20](https://github.com/LeapFE/luban/compare/v2.0.0-next.19...v2.0.0-next.20) (2021-04-22)


### Bug Fixes

* **cli:** use 'console.log' instead of 'error', fix 'error is not defined' ([e6c05d2](https://github.com/LeapFE/luban/commit/e6c05d2d9873bf848308310f1d5c802072c7fb8c))
* **eslint:** use 'eslint-webpack-plugin' instead 'eslint-loader' ([1a5ab86](https://github.com/LeapFE/luban/commit/1a5ab86cfc6564ce4fea76cd6c113a87cef70fd9))





# [2.0.0-next.19](https://github.com/LeapFE/luban/compare/v2.0.0-next.18...v2.0.0-next.19) (2021-04-22)


### Features

* **cli-plugin-service:** clear console down before restart dev server ([42e5020](https://github.com/LeapFE/luban/commit/42e5020c3d9617cb671abc1319aaea5126247713))





# [2.0.0-next.18](https://github.com/LeapFE/luban/compare/v2.0.0-next.17...v2.0.0-next.18) (2021-04-21)


### Bug Fixes

* **cli-plugin-service:** add some types devDependencies ([3b8ff78](https://github.com/LeapFE/luban/commit/3b8ff78bb662dc42258cba8f8a4d1a9579ae2c91))
* **cli-plugin-service:** modify prettierignore file(ignore 'src/.luban' dir) ([9450e8a](https://github.com/LeapFE/luban/commit/9450e8a67b9184ace34d4ddba0f2b03f7fc406ab))
* **cli-plugin-service,cli-plugin-eslint:** protected 'service' instance in PluginAPI ([53c834e](https://github.com/LeapFE/luban/commit/53c834e337e0f0f25e6d4bfe1689e4a43d26eb21))


### Features

* **cli-plugin-service:** watch .env*、src/index.tsx、src/route.ts、luban.config.ts files ([6e528f3](https://github.com/LeapFE/luban/commit/6e528f3ed7178c9be673855a4337eb7980cb4f17))





# [2.0.0-next.17](https://github.com/LeapFE/luban/compare/v2.0.0-next.15...v2.0.0-next.17) (2021-04-21)


### Bug Fixes

* **babel:** add 'react-refresh/babel' plugin just in 'development' env in babel.config.js ([58e2404](https://github.com/LeapFE/luban/commit/58e24048443d3bbea2b3b851168689d7ebd07a4f))
* **cli-plugin-service:** build server side deployed file when enable ssr ([5eda14f](https://github.com/LeapFE/luban/commit/5eda14fb504bdbacb0d2daaf206cefb7a00be962))
* **cli-plugin-service:** catch exception while clean dest files ([ef3b01d](https://github.com/LeapFE/luban/commit/ef3b01db01c541278545d52d36769a5d32f39760))
* **cli-plugin-service:** remove clean-webpack-plugin and manually delete dest fir ([19c2d57](https://github.com/LeapFE/luban/commit/19c2d57010d5de0baa04b036687e4b1f2b74cdcd))
* **test:** modify unit test snapshots dir name in template ([afd0f10](https://github.com/LeapFE/luban/commit/afd0f1052d3ac9fd4ed4ce32b19af599e88526cd))


### Features

* **cli-plugin-service:** command plugin can add webpack config instance ([a087ec5](https://github.com/LeapFE/luban/commit/a087ec580b664599820d23654b195da25ff5e022))





# [2.0.0-next.16](https://github.com/LeapFE/luban/compare/v2.0.0-next.15...v2.0.0-next.16) (2021-04-20)


### Bug Fixes

* **babel:** add 'react-refresh/babel' plugin just in 'development' env in babel.config.js ([58e2404](https://github.com/LeapFE/luban/commit/58e24048443d3bbea2b3b851168689d7ebd07a4f))
* **cli-plugin-service:** remove clean-webpack-plugin and manually delete dest fir ([19c2d57](https://github.com/LeapFE/luban/commit/19c2d57010d5de0baa04b036687e4b1f2b74cdcd))





# [2.0.0-next.15](https://github.com/LeapFE/luban/compare/v2.0.0-next.14...v2.0.0-next.15) (2021-04-20)


### Bug Fixes

* **cli-plugin-service:** after load and set env and load command and config plugin ([630644b](https://github.com/LeapFE/luban/commit/630644b05c9e17c41a5e022bfa65f1465a44d331))
* **eslint:** modify eslint(extends) ([86453c6](https://github.com/LeapFE/luban/commit/86453c63a6be3376420e9d67cdd99eae440bf9c5))





# [2.0.0-next.14](https://github.com/LeapFE/luban/compare/v2.0.0-next.13...v2.0.0-next.14) (2021-04-20)


### Bug Fixes

* **cli-plugin-service:** modify 'APP_PUBLIC_PATH' in .env.development ([58dcb62](https://github.com/LeapFE/luban/commit/58dcb62fd4f582230c7490a1532bc5d804c3b757))


### Features

* **cli-plugin-service:** produce boilerplate ([3b41f71](https://github.com/LeapFE/luban/commit/3b41f71c724dd2d4f52e8d760ffb6c1c17268e86))
* **cli-plugin-service:** refact command plugin ([20c026a](https://github.com/LeapFE/luban/commit/20c026a82b01b8678c4a99d3722903bd15cd4a59))
* **cli-plugin-service:** refact config plugin ([a243efa](https://github.com/LeapFE/luban/commit/a243efa2b1f883b7017815a6e65b76cb7ef9bd0a))
* **cli-plugin-service:** refact service plugin ([4f8283a](https://github.com/LeapFE/luban/commit/4f8283ae204e6c5f9b877e953114a2d32a85e92b))
* **cli-plugin-service:** server side render for local develop ([b6a6288](https://github.com/LeapFE/luban/commit/b6a6288b42f3632c1818422b29d63e2b2d529543))
* **store,router,typescript:** remove plugin(store, router, typescript) ([26216ca](https://github.com/LeapFE/luban/commit/26216ca1771983063216b83495fbb242c4b37d38))





# [2.0.0-next.13](https://github.com/LeapFE/luban/compare/v2.0.0-next.12...v2.0.0-next.13) (2021-03-22)


### Bug Fixes

* **stylelint:** adjust stylelint rules ([8a50a75](https://github.com/LeapFE/luban/commit/8a50a75b6efac518d34ef52cf78838e1fefc8008))
* **unit-test:** modify 'coveragePathIgnorePatterns' field in jest.config.js ([cf03131](https://github.com/LeapFE/luban/commit/cf0313185a8b9bfedceded4aa5424b8cd1a35ee0))


### Features

* **eslint:** adjust version about eslint plugins and config ([ecf4c57](https://github.com/LeapFE/luban/commit/ecf4c578cc69ac48bc00a5e834ef947a4b6154c3))





# [2.0.0-next.12](https://github.com/LeapFE/luban/compare/v2.0.0-next.11...v2.0.0-next.12) (2021-03-22)


### Bug Fixes

* **cli-plugin-service:** `createProjectConfig` function params type error in luban.config.ts ([5c90446](https://github.com/LeapFE/luban/commit/5c904467e3d5e5f977a453b25a6405e162e7684f))
* **unit-test:** modify jest.config.js in template ([3ad68c5](https://github.com/LeapFE/luban/commit/3ad68c5f90058f028e8ba025abee80242caecb72))


### Features

* **unit-test:** add example of unit-test in template ([b0db70d](https://github.com/LeapFE/luban/commit/b0db70dfa6714d1ca7d85bac846038594079fe9c))
* remove all js template ([10ea048](https://github.com/LeapFE/luban/commit/10ea048764a0f9051aa0e9a283931e4a537de129))





# [2.0.0-next.11](https://github.com/LeapFE/luban/compare/v2.0.0-next.10...v2.0.0-next.11) (2021-03-10)


### Features

* cancel dev language(javascript) support ([7e3f65b](https://github.com/LeapFE/luban/commit/7e3f65b0ae988de1292a7cfdb79f31b912324527))





# [2.0.0-next.10](https://github.com/LeapFE/luban/compare/v2.0.0-next.9...v2.0.0-next.10) (2021-02-13)


### Bug Fixes

* **cli-lib-service:** remove 'coverage' script ([bfbab3e](https://github.com/LeapFE/luban/commit/bfbab3ee7205b669d6874aac25858a0a3abc8f38))
* **cli-lib-service:** render correct jest config(collectCoverageFrom) ([07ca11d](https://github.com/LeapFE/luban/commit/07ca11d2d0afd611b810d8acdbca59cff8df7cfc))





# [2.0.0-next.9](https://github.com/LeapFE/luban/compare/v2.0.0-next.8...v2.0.0-next.9) (2021-02-11)


### Bug Fixes

* **cli-lib-service:** lock react and react-dom version ([6df24bc](https://github.com/LeapFE/luban/commit/6df24bc07478836bdf37d5afcc827d01c8bd22a0))
* **cli-lib-service:** pass 'version' param exception when run publish ([bd6ddee](https://github.com/LeapFE/luban/commit/bd6ddee2ffa06985778a116f50c11b84b2af7728))
* **cli-lib-service:** remove 'private' field while create lib ([d150755](https://github.com/LeapFE/luban/commit/d1507550de6f80d3d3c75b2d3e2eaa4a10d17e2b))
* **cli-lib-service:** type error(import path case) ([57d2c70](https://github.com/LeapFE/luban/commit/57d2c709d7923c05b38aeb77b283720ab5479d3e))





# [2.0.0-next.8](https://github.com/LeapFE/luban/compare/v2.0.0-next.7...v2.0.0-next.8) (2021-02-01)


### Bug Fixes

* **cli-lib-service:** adjust .mdx file in template ([308d001](https://github.com/LeapFE/luban/commit/308d0013c4123585d48dba715cc2e2ba9b2c33f9))





# [2.0.0-next.7](https://github.com/LeapFE/luban/compare/v2.0.0-next.6...v2.0.0-next.7) (2021-01-30)


### Reverts

* **cli-lib-service:** adjust template structure ([108ef3f](https://github.com/LeapFE/luban/commit/108ef3f4c87cee0095e0d3feeae539e9150acb4a))





# [2.0.0-next.6](https://github.com/LeapFE/luban/compare/v2.0.0-next.5...v2.0.0-next.6) (2021-01-29)


### Bug Fixes

* **cli-lib-service:** adjust some config file and template ([7d1389e](https://github.com/LeapFE/luban/commit/7d1389e3e0e8097ba9a97e8de01aaf5a45232148))





# [2.0.0-next.5](https://github.com/LeapFE/luban/compare/v2.0.0-next.4...v2.0.0-next.5) (2021-01-28)


### Bug Fixes

* **cli-lib-service:** supported build and publish command ([a1bab5e](https://github.com/LeapFE/luban/commit/a1bab5ecbe6f729c22eb5da7660ce2397b259aac))
* **cli-plugin-unit-test:** modify jest config file ([f08b68c](https://github.com/LeapFE/luban/commit/f08b68cdb3a0d6857671843abd5042726aebdb08))


### Features

* **cli-lib-service:** add entry(main) file ([ad5dd99](https://github.com/LeapFE/luban/commit/ad5dd99622fcde0dab9ce62eaae2103b82eefb4e))





# [2.0.0-next.4](https://github.com/LeapFE/luban/compare/v2.0.0-next.3...v2.0.0-next.4) (2021-01-26)


### Bug Fixes

* **all:** import reference path for `GeneratorAPI` ([3c4f93a](https://github.com/LeapFE/luban/commit/3c4f93a861c66e2d9cdce0c00f56b308e26111bc))
* **cli-plugin-service:** correctly require builtin plguins ([a5a3a9a](https://github.com/LeapFE/luban/commit/a5a3a9ab9483107f24d5ada8af0ab4807c7ba15c))
* **cli-plugin-service:** fix type error ([3a785b5](https://github.com/LeapFE/luban/commit/3a785b54a17f700924a5a08341cfc955f11885dc))


### Features

* **cli:** supported create library ([7cff44f](https://github.com/LeapFE/luban/commit/7cff44fea367c62381033c2f11229d10c56b992f))
* **cli-lib-service:** support create lib project ([209f739](https://github.com/LeapFE/luban/commit/209f739af007c0496da989c965ec66eeed87a614))





# [2.0.0-next.3](https://github.com/LeapFE/luban/compare/v2.0.0-next.2...v2.0.0-next.3) (2020-10-29)


### Bug Fixes

* **cli-plugin-service:** load file error ([96e411c](https://github.com/LeapFE/luban/commit/96e411c713799e1567f043a5f4cd5c1f50370282))





# [2.0.0-next.2](https://github.com/LeapFE/luban/compare/v2.0.0-next.1...v2.0.0-next.2) (2020-10-29)


### Bug Fixes

* **cli-shared-utils:** export `loadFile` ([ee89111](https://github.com/LeapFE/luban/commit/ee89111449bd03daf1fcc60ccafa4425db93dc7a))





# [2.0.0-next.1](https://github.com/LeapFE/luban/compare/v2.0.0-next.0...v2.0.0-next.1) (2020-10-29)


### Bug Fixes

* **cli:** correctly resolve deps ([0d95588](https://github.com/LeapFE/luban/commit/0d95588f752021c5e90201172b2d81fae1d16050))





# [2.0.0-next.0](https://github.com/LeapFE/luban/compare/v1.4.2...v2.0.0-next.0) (2020-10-28)


### Bug Fixes

* **cli:** modify that get package.json way ([fd94739](https://github.com/LeapFE/luban/commit/fd94739eecc445c0e56d6d6f4c69ce877d61f275))





## [1.4.2](https://github.com/LeapFE/luban/compare/v1.4.1...v1.4.2) (2020-08-26)


### Features

* **cli:** version update notify ([0d17244](https://github.com/LeapFE/luban/commit/0d172442fe79459728f0f5137cbd2dd2562ebbbf))





## [1.4.1](https://github.com/LeapFE/luban/compare/v1.4.0...v1.4.1) (2020-08-26)


### Bug Fixes

* **service:** exception while compile luban.config.ts file ([889d24e](https://github.com/LeapFE/luban/commit/889d24e53b52891ac8d5722a27a1142d18826a3e))


### Features

* **fetch:** move `env.{ts,js}` ([aac8943](https://github.com/LeapFE/luban/commit/aac894352ad9505808846bd7dbfad5a1356dc5f4))





# [1.4.0](https://github.com/LeapFE/luban/compare/v1.4.0-beta.2...v1.4.0) (2020-07-27)

**Note:** Version bump only for package luban





# [1.4.0-beta.2](https://github.com/LeapFE/luban/compare/v1.4.0-beta.1...v1.4.0-beta.2) (2020-07-25)

**Note:** Version bump only for package luban





# [1.4.0-beta.1](https://github.com/LeapFE/luban/compare/v1.4.0-beta.0...v1.4.0-beta.1) (2020-07-24)

**Note:** Version bump only for package luban





# [1.4.0-beta.0](https://github.com/LeapFE/luban/compare/v1.3.3...v1.4.0-beta.0) (2020-07-21)

**Note:** Version bump only for package luban





## [1.3.3](https://github.com/LeapFE/luban/compare/v1.3.3-beta.0...v1.3.3) (2020-07-17)

**Note:** Version bump only for package luban





## [1.3.3-beta.0](https://github.com/LeapFE/luban/compare/v1.3.2...v1.3.3-beta.0) (2020-07-17)

**Note:** Version bump only for package luban





## [1.3.2](https://github.com/LeapFE/luban/compare/v1.3.1-beta.21...v1.3.2) (2020-06-09)

**Note:** Version bump only for package luban





## [1.3.1-beta.21](https://github.com/LeapFE/luban/compare/v1.3.1-beta.20...v1.3.1-beta.21) (2020-06-07)


### Bug Fixes

* **cli:** strict judge project name' that created not empty ([ac120f8](https://github.com/LeapFE/luban/commit/ac120f823b4294409ead4091c3938a03dc24dfe3))





## [1.3.1-beta.20](https://github.com/LeapFE/luban/compare/v1.3.1-beta.19...v1.3.1-beta.20) (2020-06-05)


### Bug Fixes

* **service:** fix compile error ([8408ca3](https://github.com/LeapFE/luban/commit/8408ca351c338c42f170546076b18e5bbabc2164))





## [1.3.1-beta.19](https://github.com/LeapFE/luban/compare/v1.3.1-beta.18...v1.3.1-beta.19) (2020-06-05)


### Features

* **commit,cli,eslint:** add feature `commit` ([795a9a1](https://github.com/LeapFE/luban/commit/795a9a13e4b7e494dce9b5af3c0ae0159fb168a6))
* **service:** default enable `compress` option in webpack-dev-server ([a3b3600](https://github.com/LeapFE/luban/commit/a3b3600724fe9a90fdc1158ffa202a7c50466156))





## [1.3.1-beta.18](https://github.com/LeapFE/luban/compare/v1.3.1-beta.17...v1.3.1-beta.18) (2020-06-04)

**Note:** Version bump only for package luban





## [1.3.1-beta.17](https://github.com/LeapFE/luban/compare/v1.3.1-beta.16...v1.3.1-beta.17) (2020-06-04)


### Bug Fixes

* **stylelint:** exclude .css.js/.css.ts in stylelint ignore file ([d59e54a](https://github.com/LeapFE/luban/commit/d59e54a14631c7049c4aaa0ebfd44e5fc09dcd82))





## [1.3.1-beta.16](https://github.com/LeapFE/luban/compare/v1.3.1-beta.15...v1.3.1-beta.16) (2020-06-04)


### Bug Fixes

* **service:** not require mock/index.js when close mock option ([8eeacfa](https://github.com/LeapFE/luban/commit/8eeacfa5004b1838c7cdc8cdeb11f76ef5d82e6b))
* **service:** skip lib check on compiling luban.config.ts ([8aa16b3](https://github.com/LeapFE/luban/commit/8aa16b3f7931c1fd06f743c87169408a6af24b4e))





## [1.3.1-beta.15](https://github.com/LeapFE/luban/compare/v1.3.1-beta.14...v1.3.1-beta.15) (2020-06-03)


### Bug Fixes

* **cli:** set correct preset when manual pick `fetch` feature ([055ce82](https://github.com/LeapFE/luban/commit/055ce82ec97e9a8bb89f36f510b7ec20fc27340b))





## [1.3.1-beta.14](https://github.com/LeapFE/luban/compare/v1.3.1-beta.13...v1.3.1-beta.14) (2020-06-03)


### Features

* **service,fetch:** add use `useRequest` sample code in template ([6f7bc9e](https://github.com/LeapFE/luban/commit/6f7bc9ead690b838521f4dad6f8c608e2d86accf))





## [1.3.1-beta.13](https://github.com/LeapFE/luban/compare/v1.3.1-beta.12...v1.3.1-beta.13) (2020-06-02)


### Bug Fixes

* **router:** import <Welcome /> error in view component ([148e372](https://github.com/LeapFE/luban/commit/148e3721ac2d549199569034f5cfa184c6159010))





## [1.3.1-beta.12](https://github.com/LeapFE/luban/compare/v1.3.1-beta.11...v1.3.1-beta.12) (2020-06-02)


### Features

* **service,typescript,fetch:** mock config file unsupported .ts file ([17f9bda](https://github.com/LeapFE/luban/commit/17f9bda32425855d1a81bcde514e367c321db049))





## [1.3.1-beta.11](https://github.com/LeapFE/luban/compare/v1.3.1-beta.10...v1.3.1-beta.11) (2020-06-02)


### Features

* **service,fetch,eslint,typescript:** built-in mock server ([8c0e99b](https://github.com/LeapFE/luban/commit/8c0e99ba1cc612332877daab56b28e6de8d25c06))





## [1.3.1-beta.10](https://github.com/LeapFE/luban/compare/v1.3.1-beta.9...v1.3.1-beta.10) (2020-05-31)


### Bug Fixes

* **service:** `TypeError: cb is not a function` error by preload-plugin ([b480858](https://github.com/LeapFE/luban/commit/b48085868bf0be3324cf651e80a7098fcd4d5985))





## [1.3.1-beta.9](https://github.com/LeapFE/luban/compare/v1.3.1-beta.8...v1.3.1-beta.9) (2020-05-31)


### Features

* **service:** supported `public` dir that not processed by webpack ([3414743](https://github.com/LeapFE/luban/commit/34147432e02714a4596f90cb737417cc3b213d8d))
* **service:** supported preload/prefetch resource ([677afd5](https://github.com/LeapFE/luban/commit/677afd5aabee7d958414ae66257775c98f97a512))





## [1.3.1-beta.8](https://github.com/LeapFE/luban/compare/v1.3.1-beta.7...v1.3.1-beta.8) (2020-05-30)


### Features

* **service:** chalk tip for compiling luban.config.ts ([a5fb8a1](https://github.com/LeapFE/luban/commit/a5fb8a13d94c3af6c8b708e1b08f38ec9436f07e))





## [1.3.1-beta.7](https://github.com/LeapFE/luban/compare/v1.3.1-beta.6...v1.3.1-beta.7) (2020-05-30)


### Features

* **stylelint:** add .stylelintignore file ([4f9234c](https://github.com/LeapFE/luban/commit/4f9234c556bfbf431d030cf2ecbfc9962969adcc))





## [1.3.1-beta.6](https://github.com/LeapFE/luban/compare/v1.3.1-beta.5...v1.3.1-beta.6) (2020-05-30)

**Note:** Version bump only for package luban





## [1.3.1-beta.5](https://github.com/LeapFE/luban/compare/v1.3.1-beta.4...v1.3.1-beta.5) (2020-05-30)

**Note:** Version bump only for package luban





## [1.3.1-beta.4](https://github.com/LeapFE/luban/compare/v1.3.1-beta.3...v1.3.1-beta.4) (2020-05-30)

**Note:** Version bump only for package luban





## [1.3.1-beta.3](https://github.com/LeapFE/luban/compare/v1.3.1-beta.2...v1.3.1-beta.3) (2020-05-30)

**Note:** Version bump only for package luban





## [1.3.1-beta.2](https://github.com/LeapFE/luban/compare/v1.3.1-beta.1...v1.3.1-beta.2) (2020-05-30)


### Bug Fixes

* **cli:** del cli-plugin-store in default preset plugin list ([1373dcd](https://github.com/LeapFE/luban/commit/1373dcd1e4319d4e6f006cb24779c11655627686))
* **cli:** set `store` prompt default value is false ([de22eb9](https://github.com/LeapFE/luban/commit/de22eb9ddc74f7be5cd0fd08c64334617264a977))
* **service:** fix bug about cancel feature `store` in default preset ([31d9bd9](https://github.com/LeapFE/luban/commit/31d9bd9865e0e78cbc48db555089099dee03149e))





## [1.3.1-beta.1](https://github.com/LeapFE/luban/compare/v1.3.1-beta.0...v1.3.1-beta.1) (2020-05-29)


### Bug Fixes

* **service:** generated sourcemap file path ([c83aa1a](https://github.com/LeapFE/luban/commit/c83aa1aa2d494758e3d4b7b4a3c48ed35c185459))





## [1.3.1-beta.0](https://github.com/LeapFE/luban/compare/v1.3.0...v1.3.1-beta.0) (2020-05-28)


### Bug Fixes

* **service:** adjust template content and typescript version ([cb164ea](https://github.com/LeapFE/luban/commit/cb164ea36a71eb0cd622e7fc36f773f64a034260))
* **service,fetch,eslint:** adjust template content ([917bdd4](https://github.com/LeapFE/luban/commit/917bdd496d99391c252ce9a87b99228b582ff200))





## [1.2.13](https://github.com/LeapFE/luban/compare/v1.2.11...v1.2.13) (2020-05-28)

**Note:** Version bump only for package luban





## [1.2.12](https://github.com/LeapFE/luban/compare/v1.2.11...v1.2.12) (2020-05-28)

**Note:** Version bump only for package luban





## [1.2.11](https://github.com/LeapFE/luban/compare/v1.2.10...v1.2.11) (2020-05-27)


### Bug Fixes

* **service:** fix some errors about cli-plugin-service ([19640a5](https://github.com/LeapFE/luban/commit/19640a5b1ed71ad8955d4d7ed25af53f48316142))
* **service,typescript:** load projectConfig file when use .js file ([322ea4e](https://github.com/LeapFE/luban/commit/322ea4e2aaf5810ff12b61ee5ab1a8447a44f702))


### Features

* **service:** use webpackbar replace webpack.ProgressPlugin ([f097e32](https://github.com/LeapFE/luban/commit/f097e321ed8931707c953ddf64d664db8d53dede))





## [1.2.10](https://github.com/LeapFE/luban/compare/v1.2.9...v1.2.10) (2020-05-26)


### Bug Fixes

* **service:** change import style when import webpack/webpack-chain ([066e357](https://github.com/LeapFE/luban/commit/066e3577a0dedea8f0f24b6d7333b9fccd2c4ec8))





## [1.2.9](https://github.com/LeapFE/luban/compare/v1.2.8...v1.2.9) (2020-05-26)


### Bug Fixes

* **service:** can't find types of webpack while compile luban.config.ts ([6b87b64](https://github.com/LeapFE/luban/commit/6b87b640186a506fa2c03876e46dffd6d7744017))





## [1.2.8](https://github.com/LeapFE/luban/compare/v1.2.7...v1.2.8) (2020-05-26)


### Bug Fixes

* **service:** export correct type of cli-plugin-service ([d8373f2](https://github.com/LeapFE/luban/commit/d8373f299656bd6a9b85e12aa826a5566bcf934e))





## [1.2.7](https://github.com/LeapFE/luban/compare/v1.2.6...v1.2.7) (2020-05-26)


### Bug Fixes

* **service:** correct export types about cli-plugin-service ([ef5f08e](https://github.com/LeapFE/luban/commit/ef5f08e59d653c955b19c7d381e618c8f39e39b7))





## [1.2.6](https://github.com/LeapFE/luban/compare/v1.2.5...v1.2.6) (2020-05-26)


### Bug Fixes

* **service,fetch,router,typescript:** adjust some dependent version ([df17bcd](https://github.com/LeapFE/luban/commit/df17bcd7f044492048574ca70e01766af0d350bd))





## [1.2.5](https://github.com/LeapFE/luban/compare/v1.2.4...v1.2.5) (2020-05-26)


### Features

* **cli,service:** cancel `store` feature in defaultPreset ([058c28c](https://github.com/LeapFE/luban/commit/058c28c41125e839258ce1793aea40d46d8693d9))
* **service:** luban.config file support ts file ([a870207](https://github.com/LeapFE/luban/commit/a870207e2009d751cd8c18e188a369c1831c7ac1))





## [1.2.4](https://github.com/LeapFE/luban/compare/v1.2.3...v1.2.4) (2020-05-14)


### Bug Fixes

* **service:** confused publicPath while ensuer slash option.publicPath ([a0c0a09](https://github.com/LeapFE/luban/commit/a0c0a09218fea52cdab645e0a185b22692c4e7e9))





## [1.2.3](https://github.com/LeapFE/luban/compare/v1.2.2...v1.2.3) (2020-05-08)


### Bug Fixes

* **eslint,stylelint:** correct npm scripts about format(prettier) ([38b09b0](https://github.com/LeapFE/luban/commit/38b09b06049ac940679cb8dbc305049d463942d1))





## [1.2.2](https://github.com/LeapFE/luban/compare/v1.2.1...v1.2.2) (2020-05-06)


### Bug Fixes

* **service:** uncaught error during load specified config file ([b9e65b4](https://github.com/LeapFE/luban/commit/b9e65b4aa5ff3c92471c2bb954ffba0a617b3f2c))





## [1.2.1](https://github.com/LeapFE/luban/compare/v1.2.0...v1.2.1) (2020-05-06)


### Bug Fixes

* **service:** can't find entry file after run build and specify --entry ([7263ea0](https://github.com/LeapFE/luban/commit/7263ea03ba58ff45c4fb94abb4d8bccf658d1e8e))


### Features

* **service:** support specify config file while run serve/build/inspect ([229918e](https://github.com/LeapFE/luban/commit/229918eace7b3381712a54cf9c8434bc202469b7))
* **service:** support specify template path ([6123bd0](https://github.com/LeapFE/luban/commit/6123bd0a7cec6f6ece7ce24e07c1fe89b3d16baa))





# [1.2.0](https://github.com/LeapFE/luban/compare/v1.1.2...v1.2.0) (2020-04-29)


### Bug Fixes

* **service:** check projectConfig schema by joi ([58deaab](https://github.com/LeapFE/luban/commit/58deaabc4dcbf3eae2d468809adbe9eb78d11bcd))


### Features

* **eslint,service:** support eslint config [leap] ([a1f2e01](https://github.com/LeapFE/luban/commit/a1f2e0190f72364f3aa3d02fae96530457292d17))





## [1.1.2](https://github.com/LeapFE/luban/compare/v1.1.1...v1.1.2) (2020-04-29)


### Bug Fixes

* **service:** generate correct scriptsDir while assetsDir.scripts empty ([6cd80d0](https://github.com/LeapFE/luban/commit/6cd80d0b312074b4a6e7e52ba529af9463aefa6d))





## [1.1.1](https://github.com/LeapFE/luban/compare/v1.1.0...v1.1.1) (2020-04-29)


### Bug Fixes

* **service:** set correctly publicPath for images while building ([a34c685](https://github.com/LeapFE/luban/commit/a34c68525693f3007ac1aa2ea4834a330cac0a5c))


### Features

* **service:** support specify assetsDir, include scripts,styles,images ([d53b1d7](https://github.com/LeapFE/luban/commit/d53b1d7b79a24aee5bb8e5677484b2699ecb416e))





# [1.1.0](https://github.com/LeapFE/luban/compare/v1.0.5...v1.1.0) (2020-04-12)


### Features

* **service:** deprecated assets field in luban.config.js ([007bb6a](https://github.com/LeapFE/luban/commit/007bb6abf64b7e7eb0b4491a35858830b0b60bc0))





## [1.0.5](https://github.com/LeapFE/luban/compare/v1.0.4...v1.0.5) (2020-04-11)


### Features

* **service:** optimize css assets use optimizeCssAssetsWebpackPlugin ([16cddcb](https://github.com/LeapFE/luban/commit/16cddcbc25697011ba575a1484af7d9176c5ec12))





## [1.0.4](https://github.com/LeapFE/luban/compare/v1.0.3...v1.0.4) (2020-03-18)

**Note:** Version bump only for package luban





## [1.0.3](https://github.com/LeapFE/luban/compare/v1.0.2...v1.0.3) (2020-03-18)

**Note:** Version bump only for package luban





## [1.0.2](https://github.com/LeapFE/luban/compare/v1.0.1...v1.0.2) (2020-03-18)

**Note:** Version bump only for package luban





## [1.0.1](https://github.com/leapFE/luban/compare/v1.0.0...v1.0.1) (2020-03-17)

**Note:** Version bump only for package luban





# [1.0.0](https://github.com/leapFE/luban/compare/v0.0.19...v1.0.0) (2020-03-17)

**Note:** Version bump only for package luban





## [0.0.19](https://github.com/leapFE/luban/compare/v0.0.18...v0.0.19) (2020-03-17)


### Features

* **fetch:** supported data fetching feature ([66977d0](https://github.com/leapFE/luban/commit/66977d0bfb48705faa55bbfabc190bd9c00a68be))





## [0.0.18](https://github.com/leapFE/luban/compare/v0.0.17...v0.0.18) (2020-03-16)

**Note:** Version bump only for package luban





## [0.0.17](https://github.com/leapFE/luban/compare/v0.0.16...v0.0.17) (2020-03-15)


### Bug Fixes

* **eslint:** ignore babel.config.js file by eslint ([81a6fc0](https://github.com/leapFE/luban/commit/81a6fc0bd87472c350c098dc7d436249f740830e))
* **service:** fix 'error is not defined' while run bin/service ([72730df](https://github.com/leapFE/luban/commit/72730df641318836fbd8de224502eeb19f840862))





## [0.0.16](https://github.com/leapFE/luban/compare/v0.0.15...v0.0.16) (2020-03-15)


### Bug Fixes

* **babel:** use babel.config.js instead .babelrc to configuration babel ([c12849a](https://github.com/leapFE/luban/commit/c12849a621727bbf173374fa80f98639e15006fc))
* **service:** fix plugin service bin dir ignored by git ([4117b68](https://github.com/leapFE/luban/commit/4117b683d7d0690ea198943cdec750205cf7fbab))
* **service:** modify document address in template ([ada5ec0](https://github.com/leapFE/luban/commit/ada5ec0772e751488f27d2d065d33e3884d6bc35))
* **utils:** fix spinner error ([6f655d2](https://github.com/leapFE/luban/commit/6f655d2e9fd618321502bb8b0831f7ee6fb2cac0))


### Features

* **service,babel:** supported UI componnet library feature ([91a952f](https://github.com/leapFE/luban/commit/91a952fd289ccedc64a33321c7219da17cc29739))
* **service,babel,cli:** unsupported UI library feature select ([689a91c](https://github.com/leapFE/luban/commit/689a91c543653053708a3ed1ad20947a9740d777))
* **unittest,babel,eslint,cli:** supported feature unit testing ([57b5452](https://github.com/leapFE/luban/commit/57b54529e6ee77fab88f505b9738ac929669897c))





## [0.0.15](https://github.com/leapFE/luban/compare/v0.0.14...v0.0.15) (2020-02-27)


### Features

* **service,router,store:** supported feature of store ([fe59d86](https://github.com/leapFE/luban/commit/fe59d86efb15a9ec0402811a489fef43b0ef29d2))





## [0.0.14](https://github.com/leapFE/luban/compare/v0.0.13...v0.0.14) (2020-02-27)

**Note:** Version bump only for package luban





## [0.0.13](https://github.com/leapFE/luban/compare/v0.0.12...v0.0.13) (2020-02-27)


### Bug Fixes

* **service:** fix bug of object destructuring while assign projectConfig ([b2d06c7](https://github.com/leapFE/luban/commit/b2d06c71a24e50bd6e277e98bdc9bed377908bd2))
* **stylelint:** fix lint-staged script name ([9c976e7](https://github.com/leapFE/luban/commit/9c976e7da82b088abfbce5322dbce914a5e0c238))





## [0.0.12](https://github.com/leapFE/luban/compare/v0.0.11...v0.0.12) (2020-02-25)


### Bug Fixes

* **utils:** fix map polyfill bugs ([0ae8ca6](https://github.com/leapFE/luban/commit/0ae8ca60acfe700faf7469ba2a1545cd59581f68))





## [0.0.11](https://github.com/leapFE/luban/compare/v0.0.10...v0.0.11) (2020-02-25)


### Bug Fixes

* **router,service,utils:** fix some bugs ([4d20904](https://github.com/leapFE/luban/commit/4d209046513689f1ed2f92d5e04b71f6a8eb8e17))





## [0.0.10](https://github.com/leapFE/luban/compare/v0.0.9...v0.0.10) (2020-02-25)


### Bug Fixes

* **cli:** require file error ([77842d9](https://github.com/leapFE/luban/commit/77842d9188459f397dcc43367623cac6c2e6cb55))





## [0.0.9](https://github.com/leapFE/luban/compare/v0.0.8...v0.0.9) (2020-02-25)


### Bug Fixes

* **cli:** fix cli build config and fix init git repository condition ([1974a9b](https://github.com/leapFE/luban/commit/1974a9b60a8c8588aee20c6681c824f33fef8135))





## [0.0.8](https://github.com/leapFE/luban/compare/v0.0.7...v0.0.8) (2020-02-25)


### Bug Fixes

* **eslint:** correction generate eslint rules ([b61a370](https://github.com/leapFE/luban/commit/b61a37064af9a7fbcae1d09403559f0b6e326369))
* **eslint:** fix settings of eslint config ([0733507](https://github.com/leapFE/luban/commit/0733507de79fe34df1f76154dbf4dcfdaafe7a34))
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

**Note:** Version bump only for package luban





## [0.0.4](https://github.com/leapFE/luban/compare/v0.0.3...v0.0.4) (2020-02-21)


### Bug Fixes

* **cli:** fix @luban-cli/cli dependencies ([157df2b](https://github.com/leapFE/luban/commit/157df2b5f57396d7cd79db19dca71b294580d7df))





## [0.0.3](https://github.com/leapFE/luban/compare/v0.0.2...v0.0.3) (2020-02-21)


### Bug Fixes

* **all:** fix some bugs ([7afcf92](https://github.com/leapFE/luban/commit/7afcf92b036d48130bdf271542e5e632068d0a6d))
* **plguin(eslint,stylelint):** fix stylelint generator rule ([adfe711](https://github.com/leapFE/luban/commit/adfe711308dd4b8c7934ec264602be946b1f818c))
* **plugin(styelint):** referenceError while stylelint generator rules ([1c9465a](https://github.com/leapFE/luban/commit/1c9465a0542b8491fc682e5a54099b94ae7b68dd))


### Features

* **cli,cli-shared-types:** supported default preset ([9630e5e](https://github.com/leapFE/luban/commit/9630e5e69041caff7ab268b608b05a90798e8815))





## 0.0.2 (2020-02-18)


### Features

* **all:** :rocket: init project ([61147c6](https://github.com/leapFE/luban/commit/61147c64b1e2bb608b73e921910077692a71df49))
