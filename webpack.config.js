const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    console.log(`Build Mode: ${argv.mode}`)
    return {
        mode: argv.mode,
        entry: {
            sdk: path.resolve(__dirname, 'src/index.ts')
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: `wortal-core.js`,
            chunkFilename: '[name].js',
            publicPath: '',
            library: {
                root: 'Wortal',
                amd: 'wortal-sdk-core',
                commonjs: 'wortal-sdk-core'
            },
            libraryTarget: 'umd',
            libraryExport: 'default'
        },
        resolve: {
            extensions: ['.ts', '.js', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules\//,
                    use: [
                        'ts-loader'
                    ]
                }
            ]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    shared: {
                        name: 'wortal-common',
                        minChunks: 2,
                    },
                },
            },
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        format: {
                            comments: false
                        },
                    },
                    extractComments: false,
                }),
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(require("./package.json").version)
            }),
        ],
        devtool: (argv.mode === "development") ? 'source-map' : false,
    };
};
