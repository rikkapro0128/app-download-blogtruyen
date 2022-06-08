const path = require("path");

module.exports = {
  target: "node",
  entry: "/src/public/index.js",
  output: {
    filename: "bundler.js",
    path: path.resolve(__dirname, "src/public"),
  },
  mode: "development",
};
