import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './vuejs_src/main.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-browser.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  plugins: [
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './vuejs_src/index.html', // Path to your source index.html file
    //   filename: '../index.html', // Output to the public directory
    // }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'src/assets', to: 'public/assets' }, // Example of copying assets
    //   ],
    // }),
  ],
  devServer: {
    static: path.join(__dirname, 'public'),
  },
};
