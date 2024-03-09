import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'test/index.js'),
    },
    output: {
        path: path.join(__dirname, '/test-compiled'),
    },
    resolve: {
        extensions: ['.js'],
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
