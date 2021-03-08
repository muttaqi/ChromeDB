const path = require('path');
const webpack = require('webpack');




module.exports = {
  mode: 'development',
  entry: './js/ts/main.js',
  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'js')],
      exclude: [/node_modules/]
    }]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  target: "node",
  devtool: 'cheap-module-source-map',
  "externals": {
    "fs": "require('fs')"
  }
}