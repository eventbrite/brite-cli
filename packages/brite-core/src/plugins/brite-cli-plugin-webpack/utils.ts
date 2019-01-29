/* eslint-disable import/unambiguous */
import { existsSync } from "fs";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import { ILogger } from "../..";
import { BriteCommandResult } from "../../commands";
import { WEB_TARGET } from "./common";

export const getWorkspaceName = (cwd = process.cwd()): string => {
	const { name } = require(path.resolve(cwd, "package.json"));

	return name;
};

export const getVendors = (target: string): string[] => {
	let vendors = ["babel-polyfill"];

	if (target === WEB_TARGET) {
		vendors = [
			// include react-app-polyfill to cover Symbol properly for react
			// issues came up in IE11 - see: EB-100275
			"react-app-polyfill/ie11",
			path.resolve(__dirname, "./webpack.prevendors.web.js"),
			...vendors,
		];
	}

	return vendors;
};

export const assertFileExists = (filePath: string): string => {
	if (!existsSync(filePath)) {
		throw new Error(`File ${filePath} does not exist.`);
	}

	return filePath;
};

const runCompilerCommand = (compilerCommand, logger: ILogger): any =>
	new Promise((resolve, reject) =>
		compilerCommand((err, stats) => {
			if (err || stats.hasErrors()) {
				if (stats && stats.compilation && stats.compilation.errors) {
					const [error] = stats.compilation.errors;

					reject(error);
				} else {
					reject(err);
				}
			} else {
				resolve(stats);
			}
		}),
	);

export const getResultOk = (message = "finished."): BriteCommandResult => ({
	code: 0,
	message,
});

const addLogging = (
	name: string,
	compiler: webpack.Compiler,
	logger: ILogger,
): void => {
	// https://web.archive.org/web/20180316100125/https://webpack.js.org/api/compiler/#event-hooks
	compiler.plugin("compile", () => {
		logger.log(`compiling ${name}...`);
	});

	compiler.plugin("done", (stats) => {
		if (
			stats &&
			stats.compilation &&
			stats.compilation.errors &&
			stats.compilation.errors.length > 0
		) {
			logger.log(`${name} failed`, stats.compilation.errors);
		} else {
			logger.log(`${name} compiled`);
		}
	});
};

export const runWebpackDevServer = (
	config: any,
	logger: ILogger,
): Promise<BriteCommandResult> =>
	new Promise<BriteCommandResult>((resolve, reject) => {
		let result = getResultOk();

		try {
			// cannot add a callback otherwise inline styles don't work as expected
			// how to observe:
			// - run playground
			// - "We've got the best icons in town!!" should have colored background
			// - above should also have hover effect
			const compiler = webpack(config);
			const workspaceName = getWorkspaceName(config.cmd);

			addLogging(`${workspaceName} (web)`, compiler, logger);

			const server = new WebpackDevServer(compiler, config.devServer);
			const { host, port, public: publicHost, publicPath } = config.devServer;

			server.listen(port, host, (err) => {
				if (err) {
					reject(err);
					return;
				}

				logger.log(
					`[${workspaceName}] webpack-dev-server running on internally at ${host}:${port}`,
				);
				logger.log(
					`[${workspaceName}] Available locally at https://${publicHost}`,
				);
				logger.log(
					`[${workspaceName}] App bundles served at https://${publicHost}${publicPath}`,
				);
			});
		} catch (e) {
			result = {
				error: e,
				message: "ERROR: webpack-dev-server failed to boot.",
				code: 1,
			};
		}

		resolve(result);
	});

export const parseResults = (
	results: BriteCommandResult[],
): BriteCommandResult => {
	const result = results.find(({ code }) => code !== 0);

	if (result) {
		return result;
	}

	return getResultOk();
};

export const runWebpack = async (
	config: any,
	command: string,
	logger: ILogger,
): Promise<BriteCommandResult> => {
	let result: BriteCommandResult = { code: 0 };

	try {
		const workspaceName = getWorkspaceName(config.cmd);
		const compiler = webpack(config);

		let args = [];

		if (command === "watch") {
			args = [config.watchOptions || {}];
			addLogging(`${workspaceName} (node)`, compiler, logger);
		}

		const compilerCommand = compiler[command].bind(compiler, ...args);
		const data = await runCompilerCommand(compilerCommand, logger);

		result = {
			...getResultOk(),
			data,
		};
	} catch (e) {
		result = {
			message: e.message,
			code: 1,
			error: e,
		};
	}

	return result;
};
