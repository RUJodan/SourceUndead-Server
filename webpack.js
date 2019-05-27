const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.jsx'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss?/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
