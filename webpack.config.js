var webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier')
var port = process.env.npm_package_config_port
var path = require('path')
var env = process.env.ENVIRONMENT === 'DEV' ? 'development' : 'production'

function config() {
  return {
    devtool: "source_map",
    cache: true,
    inline: true,
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
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
      new webpack.HotModuleReplacementPlugin(),
      new WebpackNotifierPlugin({title: 'Browser-' + env}),
      // new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
      new webpack.IgnorePlugin(/^\.\/stores\/appStore$/),
      new webpack.IgnorePlugin(/^spellchecker/),
      new webpack.DefinePlugin({
        'process.env': {
          ENVIRONMENT: JSON.stringify(env),
          PORT: port
        }
      })
    ]
  }
}

function development () {
  var dev = config()
  dev.devServer = {
    publicPath: 'http://localhost:' + port + '/build/'
  }
  return dev
}

function production () {
  var prod = config()
  prod.plugins.push(new webpack.optimize.DedupePlugin())
  prod.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true))
  prod.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['module', 'exports', 'require']
    }
  }))
  return prod
}

function merge (config, env) {
  var merged = Object.assign({}, config, env)
  merged.plugins = (config.plugins || []).concat(env.plugins || [])
  return merged
}

var app = {
  name: 'src',
  target: 'electron',
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
    path:  path.resolve(__dirname, 'build'),
    publicPath: './build/',
    sourceMapFilename: '[file].map',
    stats: { colors: true }
  }
}
module.exports = {
  development: [
    merge(app, development())
  ],
  production: [
    merge(app, production())
  ],
  test: [
    merge(app, production())
  ]
}[env]
