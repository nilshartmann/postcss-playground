
const path = require('path');
const chokidar = require('chokidar');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const publicPath = config.output.publicPath;


const devServer = new WebpackDevServer(webpack(config), {
  publicPath: publicPath,
  contentBase: './example',
  hot: true,
  historyApiFallback: true,
  quiet: false,
  stats: {
    colors: true
  }
});


devServer.listen(3333, 'localhost', function (err) {
  if (err) {
    console.log(err);
    return err;
  }

  // make sure that our bundle is re-build by webpack when
  // on of our own plugin TS files is changed/added/removed
  chokidar.watch('./plugin/src/*.ts', {
    ignoreInitial: true,
  }).on('all', (event, path) => {
    console.log('TS File changed', event, path);
    devServer.middleware.invalidate();
  });

  console.log('Listening at localhost:3333');
});
