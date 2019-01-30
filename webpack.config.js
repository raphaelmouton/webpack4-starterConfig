const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const dev = process.env.NODE_ENV === "dev";

let cssLoaders = [
    {loader: 'css-loader', options: {importLoaders: 1}},
]

if (!dev) {
    cssLoaders.push({
        loader: 'postcss-loader',
        options: {
            plugins: (loader) => [
                require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie > 8']
                }),
            ]
        }
    })
}

let config = {
    entry: {
        app: './assets/js/app.js'
    },
    watch: dev,
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    ...cssLoaders
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    ...cssLoaders, 'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        })
    ]
}

if (!dev) {
    config.plugins.push(new UglifyJsPlugin({
        sourceMap: false
    }))
}
module.exports = config