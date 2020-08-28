const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const dotenv = require('dotenv').config()

const pagesDir = path.resolve(__dirname, 'src/templates/pages')
const pages = fs.readdirSync(pagesDir).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['@babel/polyfill', './app.js']
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          self: true
        },
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: '[path][name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    ...pages.map(page => {
      return new HTMLWebpackPlugin({
        template: `${pagesDir}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`
      })
    })
  ],
  devServer: {
    host: process.env.DEV_SERVER_HOST,
    port: process.env.DEV_SERVER_PORT
  },
  devtool: 'source-map'
}
