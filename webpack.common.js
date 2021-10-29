const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const extractSass = new MiniCssExtractPlugin({
  filename: "[name].min.css",
  chunkFilename: "[id].css"
});

module.exports = {
  entry: {
    "arc-airlines": "./src/index.jsx"
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.js"
    },
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    extractSass
  ]
};
