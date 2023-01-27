function makeConfig(target) {
    const fileMap = {
        node: 'index.js',
        web: 'index.browser.js',
    };

    return {
        mode: 'none',
        target,
        output: {
            filename: fileMap[target],
            library: {
                name: 'ReactDualListbox',
                type: 'umd',
                umdNamedDefine: true,
            },
        },
        externals: [
            {
                react: {
                    root: 'React',
                    commonjs2: 'react',
                    commonjs: 'react',
                    amd: 'react',
                },
                'react-dom': {
                    root: 'ReactDOM',
                    commonjs2: 'react-dom',
                    commonjs: 'react-dom',
                    amd: 'react-dom',
                },
            },
        ],
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
}

module.exports = makeConfig;
