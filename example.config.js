var webpack = require('webpack');
var name = require('./package.json').name;
var description = require('./package.json').description;
var version = require('./package.json').version;
var path = require('path');

config = {
    devtool: process.env.NODE_ENV !== 'production' ? 'cheap-eval-source-map' : null,

    entry: {
        main: [
            './example/App.js'
        ]
    },

    output: {
        // path: './app/assets/javascripts/generated',
        path: 'build',
        publicPath: 'build',
        filename: 'app-bundle.js'
    },

    module: {
        noParse: [
            /\/babel-core\/browser-polyfill\.js$/
        ],
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules[\/\\]/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        }, {
            test: /\.(png|eot|woff2|ttf|svg|woff)$/,
            loader: 'url-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: require.resolve('react'),
            loader: 'expose?React'
        }, {
            test: require.resolve('react-dom'),
            loader: 'expose?ReactDOM'
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: '"' + process.env.NODE_ENV + '"',
                    RC: JSON.stringify(JSON.parse(!!process.env.RC))
                },
                appData: {
                    name: '"' + name + '"',
                    description: '"' + description + '"',
                    version: '"' + version + '"'
                }
            }
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            CSSModules: 'react-css-modules',
        }),
    ],

    resolve: {
        root: [
            path.resolve('./client')
        ],
        extensions: ['', '.js', '.jsx']
    }
};

module.exports = config;
