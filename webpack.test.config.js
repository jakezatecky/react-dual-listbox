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
        extensions: ['.js', '.jsx'],
        alias: {
            'react-dual-listbox': path.resolve(__dirname, 'src/js/DualListBox'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
        ],
    },
};
