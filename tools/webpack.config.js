import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import pkg from '../package.json';
import ReactIntlPlugin from 'react-intl-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyse = process.argv.includes('--analyse') || process.argv.includes('--analyze');
const port = parseInt(process.env.PORT || '3000', 10);
const analyzerPort = port + 3;

// Can be `server`, `static` or `disabled`.
// In `server` mode analyzer will start HTTP server to show bundle report.
// In `static` mode single HTML file with bundle report will be generated.
// In `disabled` mode you can use this plugin to just generate Webpack Stats JSON
// file by setting `generateStatsFile` to `true`.
let analyzerMode = 'disabled';
if (isAnalyse) {
  analyzerMode = 'server';
} else if (!isDebug) {
  analyzerMode = 'static';
}

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  context: path.resolve(__dirname, '../src'),

  output: {
    path: path.resolve(__dirname, '../build/public/'),
    publicPath: '/',
    pathinfo: isVerbose,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            ['env', {
              targets: {
                browsers: pkg.browserslist,
              },
              modules: false,
              useBuiltIns: false,
              debug: false,
            }],
            // ...isDebug ? [["react-intl", {"messagesDir": "./src/assets/languages/"}]] : [],
            // Experimental ECMAScript proposals
            // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
            'stage-2',
            // JSX, Flow
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            'react',
            // Optimize React code for the production build
            // https://github.com/thejameskyle/babel-react-optimize
            ...isDebug ? [] : ['react-optimize'],
          ],
          plugins: [
            ["react-intl", {
              "enforceDescriptions": false,
              "messagesDir": "./src/assets-front/languages/"
            }],
            // Adds component stack to warning messages
            "rapscallion/babel-plugin-client",
            // "rapscallion/babel-plugin-server",

            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
            ...isDebug ? ['transform-react-jsx-source'] : [],
            // Adds __self attribute to JSX which React will use for some warnings
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
            ...isDebug ? ['transform-react-jsx-self'] : [],
          ],
        },
      },
      {
        test: /\.(sass|scss)/,
        use: ExtractTextPlugin.extract({
	        fallback: 'style-loader',
	        //resolve-url-loader may be chained before sass-loader if necessary
	        use: [
		        {
			        loader: 'css-loader',
			        options: {
				        // CSS Loader https://github.com/webpack/css-loader
				        importLoaders: 1,
				        sourceMap: false,
				        // CSS Modules https://github.com/css-modules/css-modules
				        modules: false,
				        localIdentName: '[local]',
				        debug: isDebug,
				        // CSS Nano http://cssnano.co/options/
				        minimize: !isDebug,
				        discardComments: { removeAll: true },
			        },
		        },
		        {
			        loader: 'postcss-loader',
			        options: {
				        config: './tools/postcss.config.js',
			        },
		        },
		        {
			        loader: 'sass-loader',
		        },
          ]
        }),
          // {
          //   loader: 'isomorphic-style-loader',
          // },



        // ],
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './lib/markdown-loader.js'),
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: isDebug ? 'assets-front/[path][name].[ext]?[hash:8]' : 'assets-front/[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|svg|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
          limit: 10000,
        },
      },
    ],
  },

  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
    ]
  },

  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = {
  ...config,

  name: 'assets-front/client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', 'client.js'],
  },

  output: {
    ...config.output,
    filename: isDebug ? 'assets-front/[name].js' : 'assets-front/[name].js?ver=[chunkhash:8]',
    chunkFilename: isDebug ? 'assets-front/[name].chunk.js' : 'assets-front/[name].chunk.js?ver=[chunkhash:8]',
  },

  resolve: { ...config.resolve },

  plugins: [
    // Define free variables
	  new ExtractTextPlugin('assets-front/style.css'),
	  new ReactIntlPlugin(),
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),

    // new webpack.ProvidePlugin({
    //   _ : "lodash",
    //   // jQuery: "jquery",
    // }),

    ...isDebug ? [] : [
      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
	      drop_console: true,
	      compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: isVerbose,
          unused: true,
          dead_code: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ],

    new BundleAnalyzerPlugin({
      // See above
      analyzerMode,
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: '127.0.0.1',
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort,
      // Path to bundle report file that will be generated in `static` mode.
      // Relative to bundles output directory.
      reportFilename: path.resolve(__dirname, '../report.html'),
      // Automatically open report in default browser
      openAnalyzer: true,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: !isDebug,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: path.resolve(__dirname, '../stats.json'),
      // Options for `stats.toJson()` method.
      // You can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: 'info',
    }),
  ],

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'cheap-module-source-map' : false,

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: ['babel-polyfill', './server.js'],
  },

  output: {
    ...config.output,
    filename: '../../build/server.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    ...config.module,

    // Override babel-preset-env configuration for Node.js
    rules: config.module.rules.map(rule => (rule.loader !== 'babel-loader' ? rule : {
      ...rule,
      query: {
        ...rule.query,
        presets: rule.query.presets.map(preset => (preset[0] !== 'env' ? preset : ['env', {
          targets: {
            node: parseFloat(pkg.engines.node.replace(/^\D+/g, '')),
          },
          modules: false,
          useBuiltIns: false,
          debug: false,
        }])),
      },
    })),
  },

  resolve: { ...config.resolve },

  externals: [
    /^\.\/assets\.json$/,
    (context, request, callback) => {
      const isExternal =
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      callback(null, Boolean(isExternal));
    },
  ],

  plugins: [
	  new ExtractTextPlugin('assets-front/style.css'),

	  // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      __DEV__: isDebug,
    }),

    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    // new webpack.BannerPlugin({
    //   // banner: 'require("source-map-support").install();',
    //   raw: true,
    //   entryOnly: false,
    // }),
  ],

  node: {
    console: false,
    // global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
};

export default [clientConfig, serverConfig];