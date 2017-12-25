const poststylus = require('poststylus');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/scripts/index.js',
    output: {
        path: path.join( __dirname, '/dist'),
        filename: 'index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
            },
            hash: true,
            template: './src/pug/index.pug',
        })
    ],
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: 'pug-html-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
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
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        stats: 'minimal',
        open: true,
    },
};
