var cssnext = require('postcss-cssnext');
var simpleGrid = require('./plugin/dist/postcss-simple-grid').default;
console.log(simpleGrid);
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", ["css-loader", "postcss-loader"])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ],
  postcss: function () {
    return [simpleGrid, cssnext];
  }
}