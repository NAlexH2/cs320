const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    hw1: path.resolve(__dirname, "src", "Main.ts"),
    lib: path.resolve(__dirname, "src", "Library.ts"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      type: "var",
      name: "[name]",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          format: {
            comments: false
          },
        },
      }),
    ],
  },
};
