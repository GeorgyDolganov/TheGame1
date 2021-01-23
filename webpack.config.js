const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: path.resolve(appDirectory, 'src/app.ts'), // path to the main .ts file
  output: {
    filename: 'js/game.js', // name for the js file that is created/compiled in memory
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080, // port that we're using for local host (localhost:8080)
    disableHostCheck: true,
    contentBase: path.resolve(appDirectory, 'public'), // tells webpack to serve from the public folder
    publicPath: '/',
    hot: true,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    }, {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],
    }],

  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, 'public/index.html'),
    }),
    new CleanWebpackPlugin(),
  ],
  mode: 'development',
  node: {
    fs: 'empty',
  },
};
