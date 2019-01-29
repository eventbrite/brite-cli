#!/usr/bin/env node
import program from "commander";
import pkg from "../package.json";

const { version } = pkg;

const [, , command] = process.argv;

program
	.version(version)
	.option(
		"--env [value]",
		"desired environment, will override NODE_ENV",
		process.env.NODE_ENV,
	)
	.option(
		"--cwd [value]",
		"directory to base the execution of the brite-cli",
		process.cwd(),
	)
	.option(
		"--port [value]",
		"port to be used for any commands requiring a server [EXPERIMENTAL]",
	)
	.option("--output-path [value]", "directory to write bundles [EXPERIMENTAL]");

const { unknown } = program.parseOptions(process.argv);

require("@eventbrite/brite-core")
	.init(command, program.opts(), unknown)
	.then(() => {
		console.log("BriteCLI ran successfully.");
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
