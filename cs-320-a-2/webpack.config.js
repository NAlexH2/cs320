const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    hw2: path.resolve(__dirname, "src", "Main.ts"),
    astlib: path.resolve(__dirname, "src", "Library", "AST.ts"),
    iolib: path.resolve(__dirname, "src", "Library", "IO.ts"),
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
          compress: false,
          mangle: false,
          format: {
            comments: false
          },
        },
      }),
    ],
  },
};
