const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  console.log("env.mode: " + env.mode);
  const mode = env.mode === "development" ? "development" : "production";
  console.log("webpack mode: " + mode);
  return {
    mode: mode,
    target: "web",
    entry: [path.join(__dirname, "src/index.js")],
    output: {
      path: path.join(__dirname, "/build"),
      filename: "bundle.js",
    },
    resolve: {
      extensions: ["*", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              // modules option: https://github.com/css-modules/css-modules
              // options: { modules: true }
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Take Home Wildlife",
        template: "public/index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ESLintPlugin({
        failOnWarning: false,
      }),
    ],
    devServer: {
      contentBase: "./public",
      hot: true,
      overlay: {
        errors: true,
      },
    },
    /**
     * In Webpack version v2.0.0 and earlier, you must tell 
     * webpack how to use "json-loader" to load 'json' files.
     * To do this Enter 'npm --save-dev install json-loader' at the 
     * command line to install the "json-loader' package, and include the 
     * following entry in your webpack.config.js.
     module: {
      rules: [{test: /\.json$/, use: use: "json-loader"}]
    }
    **/
  };
};
