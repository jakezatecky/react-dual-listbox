const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        filename: 'index.js',
        library: {
            name: 'ReactDualListBox',
            type: 'umd',
        },
    },
    resolve: {
        alias: {
            'react-dual-listbox': path.resolve(__dirname, 'src/js/DualListBox'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
        ],
    },
};
