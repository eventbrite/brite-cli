import { CLIEngine } from "eslint";
import { TaskFunction } from "../types";
import defaults from "./defaults";

const eslintTask: TaskFunction = async (logger, { cwd }) => {
	const cli = new CLIEngine({
		cwd,
		...defaults,
	});

	logger.debug(`eslint version: ${CLIEngine.version}`);

	const { results, errorCount, warningCount } = await cli.executeOnFiles([cwd]);
	const formatter = cli.getFormatter();

	logger.log(formatter(results));
	const hasErrorsOrWarnings = errorCount > 0 || warningCount > 0;

	return !hasErrorsOrWarnings;
};

export default eslintTask;
