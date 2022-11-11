const path = require('path');
const webpack = require('webpack');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    entry: {
        sdk: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'wortal-core.js',
        chunkFilename: IS_PRODUCTION ? '[name].[chunkhash].js' : '[name].chunk.js',
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
    devtool: IS_PRODUCTION ? 'hidden-source-map' : 'eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(require("./package.json").version)
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
};
