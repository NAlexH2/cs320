const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    main: path.resolve(__dirname, "src", "Main.ts"),
    ast: path.resolve(__dirname, "src", "AST.ts"),
    syntaxAnalysis: path.resolve(__dirname, "src", "SyntaxAnalysis.ts"),
    treelib: path.resolve(__dirname, "src", "Library", "Trees.ts"),
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
