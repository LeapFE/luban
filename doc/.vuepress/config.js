function getCliVersion() {
  return require("./../../packages/@luban/cli/package.json").version;
}

module.exports = {
  title: "Luban",
  description: "🛠 插件化的 React 应用开发框架",
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
        text: `${getCliVersion()}`,
        link: "https://www.npmjs.com/package/@luban-cli/cli",
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
          collapsable: false,
          children: [
            "/document/structure",
            "/document/browser-compatibility",
            "/document/html-and-static-assets",
            "/document/css",
            "/document/webpack",
            "/document/mode-and-env",
            "/document/linter",
            "/document/ui-library",
            "/document/router",
            "/document/deployment",
            "/document/typescript",
            "/document/unittest",
            "/document/data-fetch",
            "/document/store",
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
  },
  plugins: [
    "@vuepress/back-to-top",
    ["@vuepress/medium-zoom", true],
    "@vuepress/active-header-links",
  ],
  extendMarkdown: (md) => {
    md.use(require("markdown-it-mark"));
  },
};
