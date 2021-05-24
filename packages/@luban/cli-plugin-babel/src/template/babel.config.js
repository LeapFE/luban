const presets = [
  [
    "@babel/preset-env",
    { modules: false, useBuiltIns: "usage", corejs: { version: 3, proposals: true } },
  ],
  "@babel/preset-react",
  "@babel/preset-typescript",
];

const plugins = ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"];

if (process.env.NODE_ENV === "development") {
  plugins.push("react-refresh/babel");
}

module.exports = {
  presets,
  plugins,
};
