import { TaskFunction } from "../types";
import jestConfigBuilder from "./configs/jest.config";

const jestRunner = require("jest");

const jestTask: TaskFunction = async (
	logger,
	{ cwd, passThroughArgs = [] },
) => {
	const jestConfig = jestConfigBuilder(cwd);
	const jestArgs = [
		...passThroughArgs,
		"--config",
		JSON.stringify(jestConfig),
		"--no-cache",
	];

	try {
		logger.debug(`jest version: ${jestRunner.getVersion()}`);

		await jestRunner.run(jestArgs);

		return true;
	} catch (ex) {
		logger.error(ex);
		return false;
	}
};

export default jestTask;
