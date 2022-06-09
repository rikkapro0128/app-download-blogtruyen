const path = require('path');

module.exports = {
  entry: '/src/public/index.js',
  output: {
    filename: 'bundler.min.js',
    path: path.resolve(__dirname, 'src/public'),
  },
  mode: 'development',
  watch: true,
};
