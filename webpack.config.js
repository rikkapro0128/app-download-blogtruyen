const path = require('path');

module.exports = {
  entry: {
    render: '/src/render/index.js',
    styles: '/src/render/style/index.js',
    assets: '/src/render/assets/index.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'src/public'),
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { outputStyle: 'compressed' },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|ico|ttf|woff)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/[folder]/[name].[ext]',
        },
      },
    ],
  },
};
