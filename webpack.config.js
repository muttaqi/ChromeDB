const path = require('path');
const webpack = require('webpack');




module.exports = {
  mode: 'development',
  entry: './js/ts/main.js',
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ],

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'js')],
      exclude: [/node_modules/]
    }]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "util": require.resolve("util"),
      "assert": require.resolve("assert"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "tls": require.resolve("tls"),
      "net": require.resolve("net"),
      "url": require.resolve("url"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream"),
      "buffer": require.resolve("buffer-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "child_process": false,
      "fs": require.resolve("browserify-fs"),
      "dns": require.resolve("dns"),
      "dgram": require.resolve("dgram-browserify")
    }
  },

  target: "web",
  devtool: 'cheap-module-source-map'
}