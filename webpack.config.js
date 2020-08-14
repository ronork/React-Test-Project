const webpack = require('webpack');

var path = require('path'); // to use path.join
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build')
    },
    module: {
        rules: [
            { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]

    },
    devServer: {
        contentBase: __dirname,
        publicPath: '/'
        // contentBase: 'dist'
    },
    node: {
        child_process: 'empty',
        fs: 'empty',
        crypto: 'empty',
        net: 'empty',
        tls: 'empty',
        console: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify('DEV')
            // Definitions...
        })
    ]
}