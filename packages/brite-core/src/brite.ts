import { ILogger } from ".";
import { BriteCommandResult, IBriteCommandOptions } from "./commands";
import { IBriteCommandRunner } from "./runner";

const DEFAULT_OPTIONS: IBriteCommandOptions = {
	cwd: process.cwd(),
	env: process.env.NODE_ENV,
};

export interface IBriteCLI<T> {
	run(task: keyof T): Promise<BriteCommandResult>;
}

/**
 * Main CLI class. The generic <T> will get set by the `cmds` parameter from the constructor
 * That allows us to use `keyof` in other methods. Therefore if you pass commands such as { test, start, build },
 * the `keyof T` will take strings of `start`, `test`, or `build`.
 */
export class BriteCLI<T> implements IBriteCLI<T> {
	public commandRunner: IBriteCommandRunner;
	public commands;
	private logger;

	constructor(commandRunner: IBriteCommandRunner, cmds: T, logger: ILogger) {
		this.commandRunner = commandRunner;
		this.commands = cmds;
		this.logger = logger;
	}

	/**
	 * Run a given command with the command runner passed in to the constructor
	 * @param cmd - You can pass either a string for a command e.g. start, or a command Constructor
	 * @param options - Optional options to pass to the comand
	 * @param args - raw arguments from the cli
	 */
	public async run(cmd: keyof T, options?, passThroughArgs: string[] = []) {
		const Command = this.findCommand(cmd);

		if (!Command) {
			this.logger.error(`Unknown command: ${cmd}`);
			this.logger.log(
				`Known commands: ${Object.keys(this.commands).join(", ")}`,
			);

			throw new Error("Unknown command");
		}

		const result = await this.commandRunner.run(Command, this.logger, {
			...DEFAULT_OPTIONS,
			...options,
			passThroughArgs,
		});

		if (result.code !== 0) {
			this.logger.error(`ERROR: Command ${Command.name} failed.`);
			this.logger.error(`- ${result.message}`);

			throw new Error(result.message);
		} else {
			if (result.message) {
				this.logger.log(result.message);
			}

			this.logger.log(
				`Command ${Command.name} ran in ${result.stats.totalTime}ms`,
			);
		}

		return result;
	}

	/**
	 * Looks at the registered commands for a string matching a constructor
	 * @param cmd - String or Constructor of a command
	 */
	private findCommand(cmd: keyof T) {
		if (!this.commands[cmd]) {
			return null;
		}

		return this.commands[cmd];
	}
}
