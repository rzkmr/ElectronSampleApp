var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  devtool: "#source-map",
  cache: true,
  inline: true,
  target: 'electron',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
    publicPath: 'http://localhost:8080/build/',
    sourceMapFilename: '[file].map',
    stats: { colors: true }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  resolve: {
    alias: {
      // The with-addons is only needed for perseus :(
      // example: 'react': path.resolve('node_modules/react/dist/react-with-addons.js'),
    },
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './build/',
    publicPath: 'http://localhost:8080/build/'
  }
};
