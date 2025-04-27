const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    background: './src/background/index.js',
    content: './src/content/index.js',
    pageScript: './src/pageScripts/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' },
        { from: 'public', to: 'public' },
        { from: 'popup/dist', to: 'popup' },
        {
          from: 'html',
          to: 'html',
          globOptions: {
            ignore: [
              // 在这里添加你想要忽略的文件或文件夹的 glob 模式
              // 例如：忽略所有 node_modules 文件夹
              '**/node_modules/**',
              // 例如：忽略所有 .tmp 文件
              '**/*.tmp',
              '**/iframePage/common/**',
              '**/iframePage/declarativeNetRequest/**',
              '**/iframePage/main/**',
              '**/iframePage/uNetwork/**',
              '**/iframePage/.eslintrc.js',
              '**/iframePage/.gitignore',
              '**/iframePage/declarativeNetRequest.html',
              '**/iframePage/favicon.png',
              '**/iframePage/index.html',
              '**/iframePage/package.json',
              '**/iframePage/stats.html',
              '**/iframePage/tsconfig.json',
              '**/iframePage/uNetwork.html',
              '**/iframePage/vite.config.js',
              '**/iframePage/yarn.lock',
              '**/iframePage/dist/**',
            ],
          },
        },
        { from: 'icons', to: 'icons' }
      ]
    })
  ]
};
