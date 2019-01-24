import ExtractTextPlugin from 'extract-text-webpack-plugin';
import jsonImporter from 'node-sass-json-importer';

export const DEV_ENV = 'development';
export const PROD_ENV = 'production';
export const NODE_TARGET = 'node';
export const WEB_TARGET = 'web';
export const DEFAULT_PORT = 7000;

export const WEBPACK_STATS = {
    all: false,
    warnings: true,
    errors: true,
    chunks: true,
    timings: true,
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        importLoaders: 1,
        sourceMap: true,
    },
};

const sassLoader = {
    loader: 'sass-loader',
    // Apply the JSON importer via sass-loader's options.
    options: {
        importer: jsonImporter,
        sourceMap: true,
    },
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
    },
};

export const styleSassRules = {
    test: /\.scss$/,
    use: [
        'style-loader',
        cssLoader,
        postcssLoader,
        sassLoader,
    ],
};

export const extractedSassRules = {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            cssLoader,
            postcssLoader,
            sassLoader,
        ],
    }),
};

export const nullSassRules = {
    test: /\.scss$/,
    use: 'null-loader',
};

export const DEV_ASSET_PATH = '/static-dj/js/';
