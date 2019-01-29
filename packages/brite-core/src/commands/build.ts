import WebpackPlugin from "../plugins/brite-cli-plugin-webpack";
import { BaseBriteCommand, BriteCommandResult } from "./command";

/**
 * Run a build
 */
export default class BriteBuildCommand extends BaseBriteCommand {
	public defaultEnvironment = "production";

	/**
	 * Executes the build command
	 */
	public async execute(): Promise<BriteCommandResult> {
		return new WebpackPlugin(this.logger, this.options).run("build");
	}
}
