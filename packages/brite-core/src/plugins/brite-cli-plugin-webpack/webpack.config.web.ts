/* eslint-disable import/unambiguous */
import { readFileSync } from "fs";
import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

import { IBriteCommandOptions } from "../../commands";
import {
	DEFAULT_PORT,
	DEV_ASSET_PATH,
	DEV_ENV,
	nullSassRules,
	PROD_ENV,
	styleSassRules,
	WEB_TARGET,
	WEBPACK_STATS,
} from "./common";
import { assertFileExists, getVendors, getWorkspaceName } from "./utils";

const getProdPlugins = () => [
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		beautify: false,
		comments: false,
		mangle: {
			screw_ie8: true,
			keep_fnames: true,
		},
		parallel: {
			cache: true,
			workers: 2,
		},
		compress: {
			screw_ie8: true,
			properties: true,
			drop_debugger: true,
			dead_code: true,
			conditionals: true,
			booleans: true,
			unused: true,
			if_return: true,
			join_vars: true,
			drop_console: true,
			warnings: false,
		},
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: true,
		sourceMap: true,
		debug: false,
	}),
];

const getDevServerConfig = (port) => {
	const config: webpack.Configuration = {
		devServer: {
			disableHostCheck: true,
			publicPath: DEV_ASSET_PATH,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			public: `www.evbdev.com:${port}`,
			host: "0.0.0.0",
			port,
			stats: WEBPACK_STATS,
		},
	};

	// Needed to work on our internal hostname over https
	if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
		config.devServer.https = {
			key: readFileSync(process.env.SSL_KEY_PATH),
			cert: readFileSync(process.env.SSL_CERT_PATH),
		};
	}

	return config;
};

const publicPath = process.env.MEDIA_URL
	? `${process.env.MEDIA_URL}/js/bundles/`
	: DEV_ASSET_PATH;

export default ({
	cwd = process.cwd(),
	env = DEV_ENV,
	port = DEFAULT_PORT,
	outputPath,
	basePath,
}: IBriteCommandOptions) => ({
	target: WEB_TARGET,
	bail: !DEV_ENV,
	devtool: env === DEV_ENV ? "cheap-module-eval-source-map" : "source-map",
	entry: {
		[getWorkspaceName(cwd)]: [
			...getVendors(WEB_TARGET),
			...(env === DEV_ENV
				? [`webpack-dev-server/client?https://www.evbdev.com:${port}`]
				: []),
			assertFileExists(path.resolve(cwd, basePath, "index.js")),
		],
	},
	externals: [
		nodeExternals({
			modulesDir: path.resolve(cwd, "node_modules"),
		}),
		nodeExternals({
			modulesDir: path.resolve(cwd, "../../node_modules"),
		}),
	],
	output: {
		path: outputPath || path.resolve(cwd, "build"),
		filename: `[name].${WEB_TARGET}.js`,
		publicPath,
		chunkFilename: `${getWorkspaceName(cwd)}.[name].async.js`,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"env",
								{
									targets: {
										browsers: ["last 2 versions", "IE 11"],
									},
									modules: false,
									loose: true,
								},
							],
							"stage-3",
							"react",
						],
						plugins: [
							"transform-class-properties",
							"dynamic-import-webpack",
							"react-hot-loader/babel",
						],
						env: {
							production: {
								plugins: [
									[
										"react-remove-properties",
										{
											properties: ["data-spec"],
										},
									],
								],
							},
						},
					},
				},
				exclude: /node_modules/,
			},
			env === PROD_ENV ? nullSassRules : styleSassRules,
		],
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: env,
			REACT_APP_TARGET: "web",
		}),
		...(env === PROD_ENV ? getProdPlugins() : []),
	],
	...(env === DEV_ENV ? getDevServerConfig(port) : { stats: WEBPACK_STATS }),
});
