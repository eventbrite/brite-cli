/* eslint-disable import/unambiguous */
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

import {IBriteCommandOptions} from '../../commands';
import {
    DEV_ENV,
    extractedSassRules,
    NODE_TARGET,
    nullSassRules,
    PROD_ENV,
    WEBPACK_STATS,
} from './common';
import {assertFileExists, getVendors, getWorkspaceName} from './utils';

const getProdPlugins = (): object[] => [
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        sourceMap: true,
        debug: false,
    }),
];

export default ({
    cwd = process.cwd(),
    env = DEV_ENV,
    outputPath,
}: IBriteCommandOptions) => ({
    bail: true,
    target: NODE_TARGET,
    devtool: 'source-map',
    entry: {
        [getWorkspaceName(cwd)]: [
            ...getVendors(NODE_TARGET),
            assertFileExists(path.resolve(cwd, 'App.js')),
        ],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: outputPath || path.resolve(cwd, 'build'),
        filename: `[name].${NODE_TARGET}.js`,
    },
    externals: [
        nodeExternals({
            modulesDir: path.resolve(cwd, 'node_modules'),
        }),
        nodeExternals({
            modulesDir: path.resolve(cwd, '../../node_modules'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                'env',
                                {
                                    targets: {
                                        node: 8,
                                    },
                                    modules: false,
                                    loose: true,
                                },
                            ],
                            'stage-3',
                            'react',
                        ],
                        plugins: [
                            'transform-class-properties',
                            'dynamic-import-webpack',
                            'react-hot-loader/babel',
                        ],
                        env: {
                            production: {
                                plugins: [
                                    [
                                        'react-remove-properties',
                                        {
                                            properties: ['data-spec'],
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.node/,
                use: ['node-loader'],
            },
            env === PROD_ENV ? extractedSassRules : nullSassRules,
        ],
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: env,
            REACT_APP_TARGET: 'server',
        }),
        ...(env === PROD_ENV ? getProdPlugins() : []),
    ],
    stats: WEBPACK_STATS,
});
