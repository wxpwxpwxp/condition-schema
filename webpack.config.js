const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/tests/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 7777,
    allowedHosts: 'all',
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
};
