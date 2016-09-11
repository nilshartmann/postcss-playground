require('ts-node/register');

const cssnext = require('postcss-cssnext');
const simpleGrid = require('./plugin/src/postcss-simple-grid').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './example/index.js',
  output: {
    path: __dirname + '/example/dist',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader'])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],
  postcss: function () {
    return [simpleGrid, cssnext];
  }
};
