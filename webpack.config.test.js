const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const path = require('node:path');

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'examples/src/index.jsx'),
        style: path.join(__dirname, 'examples/src/scss/style.scss'),
    },
    output: {
        path: path.join(__dirname, 'examples/dist'),
        library: {
            name: 'ReactDualListBox',
            type: 'umd',
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'react-dual-listbox': path.resolve(__dirname, 'src/index.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        open: true,
        static: {
            directory: path.join(__dirname, 'examples/dist'),
        },
        watchFiles: ['src/**/*', 'examples/src/**/*'],
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: 'examples/src/index.html',
            },
            js: {
                filename: '[name].[contenthash:8].js',
            },
            css: {
                filename: '[name].[contenthash:8].css',
            },
        }),
    ],
};
