const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'ReactDualListBox',
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
                exclude: /(node_modules|bower_components|vender_modules)/,
                loader: 'babel-loader',
            },
        ],
    },
};
