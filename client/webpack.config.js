const poststylus = require('poststylus');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PATHS = {
    src: path.join( __dirname, '/src'),
    dist: path.join( __dirname, '/dist'),
};
const FILES = {
    entry: path.join(PATHS.src, '/scripts/index.js'),
    template: path.join(PATHS.src, '/pug/index.pug'),
};

module.exports = {
    entry: FILES.entry,
    output: {
        path: PATHS.dist,
        filename: 'index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
            },
            hash: true,
            mobile: true,
            template: FILES.template,
            title: "Testing!"
        })
    ],
    module: {
        rules: [
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules|webpack.js/,
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules|webpack.js/,
                options: {
                    fix: true
                }
            }
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer', 'rucksack-css'])],
                },
            },
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    devServer: {
        contentBase: PATHS.dist,
        compress: true,
        port: 8080,
        stats: 'minimal',
        open: true,
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};
