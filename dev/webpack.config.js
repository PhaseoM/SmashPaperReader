const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./index.tsx', './less/main.less'],
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            // options: {
            //   modules: true
            // }
          },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     modules: true,
          //     postcssOptions: {
          //       plugins: [
          //         [
          //           "postcss-preset-env",
          //           {
          //             // Options
          //           },
          //         ],
          //       ],
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.m?js$/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env"], // ensure compatibility with older browsers
      //       plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
      //     },
      //   },
      // },
      // {
      //   test: /\.js$/,
      //   loader: "webpack-remove-debug", // remove "debug" package
      // },
    ],
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // This copies `public/index.html` into the build output directory.
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      /* This ensures that links to injected scripts, styles and images start at the
       * root instead of being relative to the current URL. Without this deep
       * URLs that target the URI don't work.
       */
      publicPath: '/',
    }),
    // This copies everything that isn't `index.html` from `public/` into the build output
    // directory.
    new CopyPlugin({
      patterns: [
        {
          from: 'public/**/*',
          filter: absPathToFile => {
            return absPathToFile !== path.resolve(__dirname, 'public', 'index.html');
          },
          transformPath: p => p.replace(/^public\//, ''),
        },
        {
          from: 'node_modules/pdfjs-dist/cmaps/',
          to: 'cmaps/',
        },
      ],
    }),
  ],
  output: {
    filename: 'main.[fullhash:6].js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    hot: true,
    host: 'localhost',
    // The `ui` host is used by the reverse proxy when requesting the UI while working locally.
    allowedHosts: ['ui'],
    historyApiFallback: true,
    port: 3000,
    // Apparently webpack's dev server doesn't write files to disk. This makes it hard to
    // debug the build process, as there's no way to examine the output. We change this
    // setting so that it's easier to inspect what's built. This in theory might make things
    // slower, but it's probably worth the extra nanosecond.
    writeToDisk: true,
    lazy: false,
  },
};
