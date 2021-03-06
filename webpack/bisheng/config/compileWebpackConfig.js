/**
 * @desc umd构建配置
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolveAppConfig = require('./resolveAppConfig');

const {
  getBabelLoaderOption,
  tsLoaderOption,
  indexPostcssOption,
  themeOption,
} = require('./getOption');

const mPath = [
  'node_modules',
  path.join(process.cwd(), "node_modules"),
  path.join(__dirname, "../../../", "node_modules"),
];

const excludePath = [
  path.join(process.cwd(), "node_modules"),
  path.join(__dirname, "../../../", "node_modules"),
];

const getExcludePath = (file) => {
  if (!file.startsWith(excludePath[0]) && !file.startsWith(excludePath[1])) {
    return true;
  }
  return false;
};

const compileWebpackConfig = {
  mode: 'production',

  entry: {
    index: path.join(process.cwd(), 'src', 'index'),
  },

  resolve: {
    modules: mPath,
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json', '.less'],
  },

  resolveLoader: {
    modules: mPath,
  },

  externals: {
    antd: 'antd',
    react: 'React',
    'react-dom': 'ReactDOM',
    'single-spa': 'singleSpa',
  },

  module: {
    rules: [{
        test(file) {
          if (/\.js|jsx$/.test(file) && getExcludePath(file)) {
            return true;
          }
        },
        loader: require.resolve('babel-loader'),
        options: getBabelLoaderOption(),
      },
      {
        test(file) {
          if (/\.ts|tsx$/.test(file) && getExcludePath(file)) {
            return true;
          }
        },
        use: [{
          loader: require.resolve('babel-loader'),
          options: getBabelLoaderOption(),
        }, {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            compilerOptions: tsLoaderOption,
          },
        }],
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: require.resolve('css-loader'),
        }, {
          loader: require.resolve('postcss-loader'),
          options: indexPostcssOption,
        }],
      },
      {
        test: /\.less$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: require.resolve('css-loader'),
        }, {
          loader: require.resolve('postcss-loader'),
          options: indexPostcssOption,
        }, {
          loader: require.resolve('less-loader'),
          options: {
            sourceMap: true,
            modifyVars: themeOption,
          },
        }],
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/vnd.ms-fontobject',
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
}

module.exports = resolveAppConfig(compileWebpackConfig);