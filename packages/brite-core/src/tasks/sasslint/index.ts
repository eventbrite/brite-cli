import lint from "sass-lint";
import { TaskFunction } from "../types";
import { SASS_CONFIG } from "./config";

const sasslintTask: TaskFunction = async (logger, { cwd }) => {
	const config = lint.getConfig(SASS_CONFIG);

	logger.log("running sasslint...");

	const results = lint.lintFiles(`${cwd}/**/*.scss`, config);

	await lint.outputResults(results, config);

	if (lint.errorCount(results).count || lint.warningCount(results).count) {
		return false;
	}

	return true;
};

export default sasslintTask;
