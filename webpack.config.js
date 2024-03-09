import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
import { readFile } from 'node:fs/promises';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const json = await readFile(new URL('./package.json', import.meta.url));
const pkg = JSON.parse(json.toString());
const banner = `
${pkg.name} - v${pkg.version}
Copyright (c) ${pkg.author}
Licensed under the ${pkg.license} License.
`;

const commonConfig = {
    mode: 'none',
    entry: path.join(__dirname, 'src/index.js'),
    resolve: {
        extensions: ['.js', '.jsx'],
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
    externals: {
        react: 'react',
    },
    plugins: [
        new webpack.BannerPlugin(banner.trim()),
    ],
};
const umdConfig = {
    ...commonConfig,
    output: {
        path: path.join(__dirname, '/lib'),
        filename: 'index.js',
        library: {
            name: 'ReactDualListbox',
            type: 'umd',
            umdNamedDefine: true,
        },
        globalObject: 'this',
    },
};
const esmConfig = {
    ...commonConfig,
    target: 'es2020',
    output: {
        path: path.join(__dirname, '/lib'),
        filename: 'index.esm.js',
        library: {
            type: 'module',
        },
    },
    experiments: {
        outputModule: true,
    },
};

function makeConfig({ target }) {
    return target === 'esm' ? esmConfig : umdConfig;
}

export default makeConfig;
