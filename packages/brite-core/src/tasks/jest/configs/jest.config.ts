import { resolve } from "path";

const jestConfigBuilder = (root: string) => {
	return {
		roots: [root],
		transform: {
			"^.+\\.js$": resolve(__dirname, "jestPreprocess.js"),
		},
		moduleNameMapper: {
			"\\.scss$": resolve(__dirname, "styleMock.js"),
		},
		setupTestFrameworkScriptFile: resolve(__dirname, "jestSetup.js"),
		snapshotSerializers: ["enzyme-to-json/serializer"],
		testMatch: ["**/*.unit.spec.js"],
		testResultsProcessor: "jest-junit",
	};
};

export default jestConfigBuilder;
