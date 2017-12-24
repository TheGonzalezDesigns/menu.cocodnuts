var poststylus = require('poststylus'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/index.js',
    output: {
        path: __dirname + '/dist',
        filename: "app.bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: false
            },
            hash: true,
            template: './src/pug/index.pug'
        })
    ],
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: 'pug-loader'
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
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
                }
            }
        })
    ]
}
