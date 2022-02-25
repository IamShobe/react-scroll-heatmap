const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: [path.resolve(src, 'index.tsx')],
    output: {
        path: dist,
    },
    module: {
        rules: [{
            test: /\.[tj]sx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                    },
                },
            ],
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
        isDevelopment && new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        host: '0.0.0.0',
        hot: true,
        historyApiFallback: true
    },
    mode: 'development'
}
