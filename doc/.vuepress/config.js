module.exports = {
  title: "Luban",
  // description: "🛠 插件化的 React 应用开发框架",
  markdown: {
    lineNumbers: true,
  },
  theme: "antdocs",
  themeConfig: {
    nav: [
      {
        text: "文档",
        link: "/document/",
      },
      {
        text: "配置",
        link: "/config/",
      },
      {
        text: "更新记录",
        link: "https://github.com/leapFE/luban/blob/master/CHANGELOG.md",
      },
      {
        text: "GitHub",
        link: "https://github.com/leapFE/luban",
      },
      {
        text: process.env.__LUBAN_VERSION__,
        link: "https://www.npmjs.com/package/@luban-cli/cli",
      },
      {
        text: "2.x 文档",
        link: "https://luban.fun",
      },
    ],
    sidebar: {
      "/document": [
        "/document/",
        "/document/installation",
        {
          title: "开始",
          collapsable: false,
          children: ["/document/creating-project", "/document/cli-service"],
        },
        {
          title: "开发指南",
          collapsable: true,
          children: [
            "/document/structure",
            "/document/css",
            "/document/mode-and-env",
            "/document/ui-library",
            "/document/router",
            "/document/typescript",
            "/document/data-fetch",
          ],
        },
        {
          title: "进阶",
          collapsable: true,
          children: [
            "/document/linter",
            "/document/webpack",
            "/document/browser-compatibility",
            "/document/html-and-static-assets",
            "/document/store",
            "/document/unittest",
            "/document/deployment",
          ],
        },
      ],
      "/config": [
        {
          title: "配置指南",
        },
      ],
    },
    lastUpdated: "上次编辑于",

    smoothScroll: true,

    repo: "https://github.com/LeapFE/luban",
    repoLabel: "查看源码",
    docsDir: "doc",
    docsBranch: "master",
    editLinks: true,
    editLinkText: "在 GitHub 上编辑此页",
  },
  plugins: [
    "@vuepress/back-to-top",
    ["@vuepress/medium-zoom", true],
    "@vuepress/active-header-links",
    "@vuepress/last-updated",
    "@vuepress/plugin-nprogress",
  ],
  extendMarkdown: (md) => {
    md.use(require("markdown-it-mark"));
  },
};
