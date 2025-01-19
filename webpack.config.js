const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dotenv = require('dotenv');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `./_config/.env.${env}` });

const publicUrl = process.env.REACT_APP_PUBLIC_BASE_URL || '';
const publicPort = process.env.REACT_APP_PUBLIC_PORT || '';
const publicPath = publicUrl && publicPort ? `${publicUrl}:${publicPort}/` : 'auto';

console.log(`Environment: ${env}`);
console.log(`Public URL: ${publicUrl}`);
console.log(`Public Port: ${publicPort}`);

module.exports = {
  entry: './src/index.js',
  mode: env,
  devServer: {
    static: path.join(__dirname, 'build'),
    ...(publicPort && { port: publicPort }),
    historyApiFallback: true,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'loginApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/_pages/Login',
      },
      shared: {
        react: {
          singleton: true
        },
        'react-dom': {
          singleton: true
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
