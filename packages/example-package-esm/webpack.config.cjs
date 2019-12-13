module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: `${__dirname}/dist/cjs`,
        libraryTarget: 'umd',
        library: 'ExamplePackageESM',
        // this is a weird hack to make the umd build work in node
        // https://github.com/webpack/webpack/issues/6525#issuecomment-417580843
        globalObject: 'typeof self !== "undefined" ? self : this',
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                loader: require.resolve('babel-loader'),
            },
        ],
    },
};
