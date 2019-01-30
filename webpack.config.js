const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dev = process.env.NODE_ENV === 'dev';

let cssLoaders = [
    {loader: 'css-loader', options: {importLoaders: 1}},
];

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

/** CONFIG DEV **/
let config = {
    mode: 'development',
    entry: {
        app: ['./assets/css/app.scss', './assets/js/app.js']
    },
    watch: dev,
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
        publicPath: '../dist/'
    },
    devtool: dev ? 'cheap-module-eval-source-map' : false,
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
            },
            {
                test: /\.(wotf2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:7].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ]
};

/** PLUGIN ONLY PROD **/
if (!dev) {
    config.plugins.push(new UglifyJsPlugin({
        sourceMap: false
    }));
    config.plugins.push(new CleanWebpackPlugin(['dist'], {
        root: path.resolve('./'),
        verbose: true,
        dry: false
    }))
}
module.exports = config;